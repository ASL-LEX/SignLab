import { ConfigService } from '@nestjs/config';
import { Query, Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ComplexityOptions } from 'joi-password-complexity';
import { AuthService } from './auth.service';
import { PasswordComplexity } from './dtos/complexity-requirements.dto';
import { UserCredentials } from './usercredentials.schema';
import { AuthResponse } from './dtos/auth-response.dto';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { UserIdentification } from './dtos/user-identification.dto';
import { UserAvailability } from './dtos/user-availability.dto';

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

  /** Check if the username and email are available */
  @Query(() => UserAvailability)
  async userAvailable(@Args('identification') identification: UserIdentification): Promise<UserAvailability> {
    return this.authService.availability(identification);
  }

  @Mutation(() => AuthResponse, { nullable: true })
  async login(@Args('credentials') credentials: UserCredentials): Promise<AuthResponse | null> {
    return this.authService.authenticate(credentials);
  }

  @ResolveField(() => User)
  async user(@Parent() authResponse: AuthResponse): Promise<User> {
    // Get the user and ensure the user exists
    const result = await this.userService.findOne({ _id: authResponse.user });
    if (!result) {
      throw new Error(`User with id ${authResponse.user} not found`);
    }

    return result;
  }
}
