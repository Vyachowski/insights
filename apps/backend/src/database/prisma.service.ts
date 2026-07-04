import { PrismaClient } from '@/prisma/generated/prisma/client';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { setTimeout } from 'timers/promises';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async connectWithRetry(): Promise<void> {
    const retries = this.configService.getOrThrow<number>(
      'DATABASE_CONNECT_RETRIES',
    );
    const delay = this.configService.getOrThrow<number>(
      'DATABASE_CONNECT_DELAY',
    );

    for (let i = 0; i < retries; i++) {
      try {
        await this.$queryRaw`SELECT current_database()`;
        return;
      } catch (error) {
        await this.handleConnectFailure(error, i, retries, delay);
      }
    }
  }

  private async handleConnectFailure(
    error: unknown,
    attempt: number,
    retries: number,
    delay: number,
  ): Promise<void> {
    this.logger.error(
      `Database connection failed. Retry ${attempt + 1}/${retries}`,
      error instanceof Error ? error.stack : String(error),
    );

    if (attempt === retries - 1) {
      throw error;
    }

    const backoff = delay * Math.pow(2, attempt);

    await setTimeout(backoff);
  }
}
