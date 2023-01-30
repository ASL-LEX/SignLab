import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { TokenPayload } from 'shared/dtos/auth.dto';
import { User } from '../user/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  /**
   * Check for the existance of the user with the given ID and return that
   * user
   */
  async validate(payload: TokenPayload): Promise<User> {
    const user = await this.userService.findOne({ _id: payload._id });
    if (!user) {
      throw new UnauthorizedException(`User with id ${payload._id} does not exist`);
    }

    return user;
  }
}
