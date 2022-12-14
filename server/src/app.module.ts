import { join } from 'path';

// Modules
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// Controllers
import { AppController } from './app.controller';

// Services
import { ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

// Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EntryModule } from './entry/entry.module';
import { TagModule } from './tag/tag.module';
import { StudyModule } from './study/study.module';
import { EntryStudyModule } from './entrystudy/entrystudy.module';
import { UserStudyModule } from './userstudy/userstudy.module';
import { BucketModule } from './bucket/bucket.module';

// By default just use OS provided environment variables
let configModule = ConfigModule.forRoot({
  ignoreEnvFile: true,
  load: [configuration],
});

// If a specific environment is provided, load variables from there
if (process.env.NODE_ENV) {
  configModule = ConfigModule.forRoot({
    envFilePath: `../.env.${process.env.NODE_ENV}`,
    load: [configuration],
  });
}

@Module({
  imports: [
    configModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../dist/'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('database.host'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    EntryModule,
    TagModule,
    StudyModule,
    EntryStudyModule,
    UserStudyModule,
    BucketModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
