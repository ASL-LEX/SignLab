import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';


export let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
