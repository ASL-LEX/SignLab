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

// Modules
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

// Controllers
import { AppController } from './app.controller';
import { AuthController } from './controllers/api/auth.controller';
import { UserController } from './controllers/api/user.controller';
import { ResponseController } from './controllers/api/response.controller';

// Services
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role.guard';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ResponseService } from './services/response.service';
import { SchemaService } from './services/schema.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../dist/prod'),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ResponseUpload.name, schema: ResponseUploadSchema },
      { name: DynamicSchema.name, schema: DynamicSchemaSchema },
      { name: Response.name, schema: ResponseSchema },
    ]),
    MongooseModule.forRoot('mongodb://localhost/signlab'),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ResponseController,
  ],
  providers: [
    AuthService,
    UserService,
    ResponseService,
    SchemaService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
