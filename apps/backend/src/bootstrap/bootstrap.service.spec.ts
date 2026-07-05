import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BootstrapService } from './bootstrap.service';
import { PrismaService } from '@/database/prisma.service';
import { fetchUrlToBuffer } from '@/common/utils/csv.utils';

jest.mock('@/common/utils/csv.utils', () => {
  const actual = jest.requireActual<typeof import('@/common/utils/csv.utils')>(
    '@/common/utils/csv.utils',
  );
  return { ...actual, fetchUrlToBuffer: jest.fn() };
});

const mockFetch = fetchUrlToBuffer as jest.MockedFunction<
  typeof fetchUrlToBuffer
>;

type CreateManyMock = jest.MockedFunction<
  (args: { data: Record<string, unknown>[] }) => Promise<{ count: number }>
>;
type CountMock = jest.MockedFunction<() => Promise<number>>;

function tableMock(count: number): {
  count: CountMock;
  createMany: CreateManyMock;
} {
  return {
    count: jest.fn<Promise<number>, []>().mockResolvedValue(count) as CountMock,
    createMany: jest
      .fn<Promise<{ count: number }>, [{ data: Record<string, unknown>[] }]>()
      .mockResolvedValue({ count: 1 }) as CreateManyMock,
  };
}

const CITIES_CSV = 'id,code,slug,name,population\n1,SAM,samara,Самара,100\n';
const SITES_CSV =
  'id,cityId,name,group,url,yandexCounterId,googleCounterId,yandexTagManagerId,googleTagManagerId\n' +
  '1,1,ses1,ses1,https://samara.example.com/,111,,,\n';

const FULL_ENV: Record<string, string> = {
  ADMIN_EMAIL: 'admin@test.com',
  ADMIN_PASSWORD: 'secret',
  ADMIN_NAME: 'Admin',
  ADMIN_LASTNAME: 'Adminov',
  USER_EMAIL: 'user@test.com',
  USER_PASSWORD: 'secret',
  USER_NAME: 'User',
  USER_LASTNAME: 'Userov',
  CITIES_CSV_URL: 'https://drive.example.com/cities',
  SITES_CSV_URL: 'https://drive.example.com/sites',
};

describe('BootstrapService', () => {
  let service: BootstrapService;
  let prisma: {
    user: ReturnType<typeof tableMock>;
    city: ReturnType<typeof tableMock>;
    site: ReturnType<typeof tableMock>;
    $executeRawUnsafe: jest.MockedFunction<(sql: string) => Promise<number>>;
  };
  let env: Record<string, string>;

  async function createService() {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BootstrapService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: { get: (key: string) => env[key] },
        },
      ],
    }).compile();

    service = moduleRef.get(BootstrapService);
  }

  beforeEach(() => {
    mockFetch.mockReset();
    env = { ...FULL_ENV };
    prisma = {
      user: tableMock(0),
      city: tableMock(0),
      site: tableMock(0),
      $executeRawUnsafe: jest
        .fn<Promise<number>, [string]>()
        .mockResolvedValue(1),
    };
  });

  describe('fresh database with full env', () => {
    beforeEach(async () => {
      mockFetch.mockImplementation((url: string) =>
        Promise.resolve(
          Buffer.from(url.includes('cities') ? CITIES_CSV : SITES_CSV),
        ),
      );
      // cities step inserts before sites step checks the count
      prisma.city.count
        .mockResolvedValueOnce(0) // cities step: empty
        .mockResolvedValue(1); // sites step: cities exist
      await createService();
      await service.onApplicationBootstrap();
    });

    it('creates both users with hashed passwords and roles', () => {
      expect(prisma.user.createMany).toHaveBeenCalledTimes(1);
      const { data } = prisma.user.createMany.mock.calls[0][0];
      expect(data).toHaveLength(2);
      expect(data[0]).toMatchObject({ email: 'admin@test.com', role: 'ADMIN' });
      expect(data[1]).toMatchObject({ email: 'user@test.com', role: 'USER' });
      expect(data[0].password).not.toBe('secret');
      expect(data[0].password).toMatch(/^\$argon2/);
    });

    it('inserts cities preserving explicit ids', () => {
      const { data } = prisma.city.createMany.mock.calls[0][0];
      expect(data[0]).toMatchObject({ id: 1, code: 'SAM', population: 100 });
    });

    it('inserts sites with empty optionals as null', () => {
      const { data } = prisma.site.createMany.mock.calls[0][0];
      expect(data[0]).toMatchObject({
        id: 1,
        cityId: 1,
        yandexCounterId: '111',
        googleCounterId: null,
      });
    });

    it('resets identity sequences for cities and sites', () => {
      const calls = prisma.$executeRawUnsafe.mock.calls.map(
        (c: string[]) => c[0],
      );
      expect(calls.some((sql: string) => sql.includes("'cities'"))).toBe(true);
      expect(calls.some((sql: string) => sql.includes("'sites'"))).toBe(true);
    });
  });

  describe('populated database', () => {
    it('skips every step and never fetches', async () => {
      prisma.user.count.mockResolvedValue(2);
      prisma.city.count.mockResolvedValue(40);
      prisma.site.count.mockResolvedValue(40);
      await createService();
      await service.onApplicationBootstrap();

      expect(prisma.user.createMany).not.toHaveBeenCalled();
      expect(prisma.city.createMany).not.toHaveBeenCalled();
      expect(prisma.site.createMany).not.toHaveBeenCalled();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('missing env vars', () => {
    it('skips all steps without fetching or inserting', async () => {
      env = {};
      await createService();
      await service.onApplicationBootstrap();

      expect(prisma.user.createMany).not.toHaveBeenCalled();
      expect(prisma.city.createMany).not.toHaveBeenCalled();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('skips users when only admin vars are set', async () => {
      env = { ADMIN_EMAIL: FULL_ENV.ADMIN_EMAIL, ADMIN_PASSWORD: 'secret' };
      await createService();
      await service.onApplicationBootstrap();

      expect(prisma.user.createMany).not.toHaveBeenCalled();
    });
  });

  describe('failed fetch', () => {
    it('logs the error and does not throw out of startup', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to fetch URL: 404'));
      await createService();

      await expect(service.onApplicationBootstrap()).resolves.toBeUndefined();
      expect(prisma.city.createMany).not.toHaveBeenCalled();
      expect(prisma.site.createMany).not.toHaveBeenCalled();
      // users step is independent of fetch and still runs
      expect(prisma.user.createMany).toHaveBeenCalledTimes(1);
    });
  });
});
