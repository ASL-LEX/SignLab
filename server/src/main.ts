import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { INestApplication } from '@nestjs/common';

const MongoStore = require('connect-mongo');

export let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);

  // TODO: Load secret from config
  app.use(
    session({
      secret: 'an-examle-secret-that-will-be-changes',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/signlab',
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native',
      }),
    }),
  );

  await app.listen(3000);
}
bootstrap();
