import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const isDev = configService.get('NODE_ENV') !== 'production';
  const port = configService.get<number>('PORT') ?? 3000;
  const allowedOrigin = configService.get<string>('ALLOWED_ORIGIN');

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: isDev ? true : allowedOrigin,
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(port);
}

void bootstrap();
