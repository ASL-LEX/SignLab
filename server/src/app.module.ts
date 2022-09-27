import { join } from 'path';

// Schema
import { User, UserSchema } from './schemas/user.schema';
import {
  ResponseUpload,
  ResponseUploadSchema,
} from './schemas/response-upload.schema';
import {
  DynamicSchema,
  DynamicSchemaSchema,
} from './schemas/dyanmicschema.schema';
import { Response, ResponseSchema } from './schemas/response.schema';
import { Study, StudySchema } from './schemas/study.schema';
import { Tag, TagSchema } from './schemas/tag.schema';
import {
  ResponseStudy,
  ResponseStudySchema,
} from './schemas/responsestudy.schema';

// Modules
import { DynamicModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { AppController } from './app.controller';
import { AuthController } from './controllers/api/auth.controller';
import { UserController } from './controllers/api/user.controller';
import { ResponseController } from './controllers/api/response.controller';
import { StudyController } from './controllers/api/study.controller';
import { TagController } from './controllers/api/tag.controller';

// Services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ResponseService } from './services/response.service';
import { SchemaService } from './services/schema.service';
import { StudyService } from './services/study.service';
import { TagService } from './services/tag.service';
import { ResponseStudyService } from './services/responsestudy.service';
import { ResponseUploadService } from './services/response-upload.service';
import { UserStudy, UserStudySchema } from './schemas/userstudy.schema';
import { UserStudyService } from './services/userstudy.service';
import { TagGuard } from './guards/tag.guard';
import { ConfigService } from '@nestjs/config';
import { BucketStorage } from './services/bucket/bucket.service';
import { BucketFactory } from './services/bucket/bucketfactory';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './services/jwt.strategy';
import configuration from './config/configuration';

// By default just use OS provided environment variables
let configModule: DynamicModule = ConfigModule.forRoot({
  ignoreEnvFile: true,
  load: [configuration]
});

// If a specific environment is provided, load variables from there
if (process.env.NODE_ENV) {
  configModule = ConfigModule.forRoot({
    envFilePath: `../.env.${process.env.NODE_ENV}`,
    load: [configuration]
  });
}

@Module({
  imports: [
    configModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../dist/'),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ResponseUpload.name, schema: ResponseUploadSchema },
      { name: DynamicSchema.name, schema: DynamicSchemaSchema },
      { name: Response.name, schema: ResponseSchema },
      { name: Study.name, schema: StudySchema },
      { name: Tag.name, schema: TagSchema },
      { name: ResponseStudy.name, schema: ResponseStudySchema },
      { name: UserStudy.name, schema: UserStudySchema },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('database.host'),
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
        signOptions: { expiresIn: '4h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ResponseController,
    StudyController,
    TagController,
  ],
  providers: [
    AuthService,
    UserService,
    ResponseService,
    SchemaService,
    ResponseService,
    StudyService,
    TagService,
    ResponseStudyService,
    ResponseUploadService,
    UserStudyService,
    TagGuard,
    JwtStrategy,
    {
      provide: BucketStorage,
      useFactory: BucketFactory.getBucket,
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
