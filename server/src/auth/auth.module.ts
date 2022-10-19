import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCredentials, UserCredentialsSchema } from './usercredentials.schema';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from '../user/user.schema';
import { UserModule } from '../user/user.module';
import { RolesGuard } from './role.guard';
import { StudyModule } from '../study/study.module';
import { UserStudyModule } from '../userstudy/userstudy.module';

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
    forwardRef(() => StudyModule),
    forwardRef(() => UserStudyModule),
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, JwtStrategy, RolesGuard ],
  exports: [ AuthService, JwtStrategy ],
})
export class AuthModule { }
