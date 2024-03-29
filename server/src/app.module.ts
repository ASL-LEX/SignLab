import { join } from 'path';

// Modules
import { Module } from '@nestjs/common';
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
import { ProjectModule } from './project/project.module';
import { GraphQLModule } from '@nestjs/graphql';
import { OrganizationModule } from './organization/organization.module';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';

// By default just use OS provided environment variables
let configModule = ConfigModule.forRoot({
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('database.host')
      }),
      inject: [ConfigService]
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        path: join(process.cwd(), './schema.gql'),
        federation: 2
      },
      playground: true
    }),
    AuthModule,
    UserModule,
    EntryModule,
    TagModule,
    StudyModule,
    EntryStudyModule,
    UserStudyModule,
    BucketModule,
    ProjectModule,
    OrganizationModule
  ],
  controllers: [AppController]
})
export class AppModule {}
