import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/validation.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { CitiesModule } from './cities/cities.module';
import { SitesModule } from './sites/sites.module';
import { MetricsModule } from './metrics/metrics.module';
import { RevenueModule } from './revenue/revenue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    CitiesModule,
    SitesModule,
    MetricsModule,
    RevenueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
