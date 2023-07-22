import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());

  app.enableCors({
    credentials: true,
  });
  await app.listen(3333);
}
bootstrap();
