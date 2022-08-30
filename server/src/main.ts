import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const MongoStore = require('connect-mongo');

export let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);

  console.log(app.get(ConfigService).get<string>('MONGO_URI'));

  // TODO: Load secret from config
  app.use(
    session({
      secret: 'an-examle-secret-that-will-be-changed',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: app.get(ConfigService).get<string>('MONGO_URI'),
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native',
      }),
    }),
  );

  await app.listen(3000);
}
bootstrap();
