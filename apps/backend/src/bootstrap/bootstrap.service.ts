import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Role } from '@/prisma/generated/prisma/client';
import { PrismaService } from '@/database/prisma.service';
import {
  assertCsvColumns,
  fetchUrlToBuffer,
  parseCsvBuffer,
} from '@/common/utils/csv.utils';
import {
  CITY_CSV_COLUMNS,
  SITE_CSV_COLUMNS,
  cityRowSchema,
  siteRowSchema,
} from './bootstrap.schemas';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.runStep('users', () => this.bootstrapUsers());
    await this.runStep('cities', () => this.bootstrapCities());
    await this.runStep('sites', () => this.bootstrapSites());
  }

  private async runStep(
    step: string,
    fn: () => Promise<string>,
  ): Promise<void> {
    try {
      this.logger.log(`Bootstrap ${step}: ${await fn()}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Bootstrap ${step} failed: ${message}`);
    }
  }

  private async bootstrapUsers(): Promise<string> {
    if ((await this.prismaService.user.count()) > 0) {
      return 'skipped (table not empty)';
    }
    const users = this.readUsersConfig();
    if (!users) return 'skipped (ADMIN_*/USER_* env vars not set)';

    const data = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await argon2.hash(u.password),
      })),
    );
    const result = await this.prismaService.user.createMany({ data });
    return `created ${result.count} users`;
  }

  private readUsersConfig() {
    const admin = this.readUserConfig('ADMIN', Role.ADMIN);
    const user = this.readUserConfig('USER', Role.USER);
    if (!admin || !user) return null;
    return [admin, user];
  }

  private readUserConfig(prefix: 'ADMIN' | 'USER', role: Role) {
    const email = this.configService.get<string>(`${prefix}_EMAIL`);
    const password = this.configService.get<string>(`${prefix}_PASSWORD`);
    if (!email || !password) return null;
    return {
      email,
      password,
      role,
      firstName: this.configService.get<string>(`${prefix}_NAME`) ?? null,
      lastName: this.configService.get<string>(`${prefix}_LASTNAME`) ?? null,
    };
  }

  private async bootstrapCities(): Promise<string> {
    if ((await this.prismaService.city.count()) > 0) {
      return 'skipped (table not empty)';
    }
    const url = this.configService.get<string>('CITIES_CSV_URL');
    if (!url) return 'skipped (CITIES_CSV_URL not set)';

    const rows = await this.fetchRows(url, CITY_CSV_COLUMNS);
    const data = rows.map((row) => cityRowSchema.parse(row));
    const result = await this.prismaService.city.createMany({ data });
    await this.resetIdSequence('cities');
    return `created ${result.count} cities`;
  }

  private async bootstrapSites(): Promise<string> {
    if ((await this.prismaService.site.count()) > 0) {
      return 'skipped (table not empty)';
    }
    if ((await this.prismaService.city.count()) === 0) {
      return 'skipped (no cities to reference)';
    }
    const url = this.configService.get<string>('SITES_CSV_URL');
    if (!url) return 'skipped (SITES_CSV_URL not set)';

    const rows = await this.fetchRows(url, SITE_CSV_COLUMNS);
    const data = rows.map((row) => siteRowSchema.parse(row));
    const result = await this.prismaService.site.createMany({ data });
    await this.resetIdSequence('sites');
    return `created ${result.count} sites`;
  }

  private async fetchRows(
    url: string,
    columns: string[],
  ): Promise<Record<string, string>[]> {
    const buffer = await fetchUrlToBuffer(url);
    const rows = parseCsvBuffer(buffer);
    assertCsvColumns(rows, columns);
    return rows;
  }

  private async resetIdSequence(table: 'cities' | 'sites'): Promise<void> {
    await this.prismaService.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "${table}"))`,
    );
  }
}
