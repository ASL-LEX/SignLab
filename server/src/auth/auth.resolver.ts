import { ConfigService } from '@nestjs/config';
import { Query, Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ComplexityOptions } from 'joi-password-complexity';
import { AuthService } from './auth.service';
import { PasswordComplexity } from './dtos/complexity-requirements.dto';
import { UserCredentials } from './usercredentials.schema';
import { AuthResponse } from './dtos/auth-response.dto';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly configService: ConfigService,
              private readonly authService: AuthService,
              private readonly userService: UserService) {}

  /** Get requirements for password complexity */
  @Query(() => PasswordComplexity)
  getPasswordComplexity(): ComplexityOptions {
    return this.configService.getOrThrow('auth.passwordComplexity');
  }

  @Mutation(() => AuthResponse, { nullable: true })
  async login(@Args('credentials') credentials: UserCredentials): Promise<AuthResponse | null> {
    return this.authService.authenticate(credentials);
  }

  @ResolveField(() => User)
  async user(@Parent() authResponse: AuthResponse): Promise<User> {
    const result = await this.userService.findOne({ _id: authResponse.user });

    if (!result) {
      throw new Error(`User with id ${authResponse.user} not found`);
    }

    return result;
  }
}
