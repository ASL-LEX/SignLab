import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserCredentials,
  UserCredentialsSchema,
} from './usercredentials.schema';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { RolesGuard } from './role.guard';
import { UserStudyModule } from '../userstudy/userstudy.module';
import { OwnerGuard } from './owner.guard';
import { ProjectGuard } from './project.guard';
import { StudyGuard } from './study.guard';
import { StudyModule } from '../study/study.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
        signOptions: { expiresIn: '4h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: UserCredentials.name, schema: UserCredentialsSchema },
    ]),
    ConfigModule,
    forwardRef(() => UserModule),
    forwardRef(() => UserStudyModule),
    forwardRef(() => StudyModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    OwnerGuard,
    ProjectGuard,
    StudyGuard,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
