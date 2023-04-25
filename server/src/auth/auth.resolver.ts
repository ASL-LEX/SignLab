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
import { UserSignup } from './dtos/user-signup.dto';
import { UserSignupPipe } from './pipes/user-signup-pipe.dto';
import { UserStudyService } from '../userstudy/userstudy.service';
import { OrganizationService } from '../organization/organization.service';
import { Organization } from 'src/organization/organization.schema';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly userStudyService: UserStudyService
  ) {}

  /** Get requirements for password complexity */
  @Query(() => PasswordComplexity)
  getPasswordComplexity(): ComplexityOptions {
    return this.authService.passwordComplexity;
  }

  /** Check if the username and email are available */
  @Query(() => UserAvailability)
  async userAvailable(@Args('identification') identification: UserIdentification): Promise<UserAvailability> {
    return this.authService.availability(identification);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('credentials') credentials: UserCredentials): Promise<AuthResponse> {
    return this.authService.authenticate(credentials);
  }

  @Mutation(() => AuthResponse)
  async signup(@Args('credentials', UserSignupPipe) signup: UserSignup): Promise<AuthResponse> {
    const authResponse = await this.authService.signup(signup);

    // Make the user studies
    // TODO: Replace with better logic for making user studies
    const user = await this.userService.findOne({ _id: authResponse.user });
    await this.userStudyService.makeForUser(user!);

    return authResponse;
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

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly orgService: OrganizationService) {}

  @ResolveField(() => Organization)
  async organization(@Parent() user: User): Promise<Organization> {
    const result = await this.orgService.findOne(user.organization);
    if (!result) {
      throw new BadRequestException(`No organization found with id ${user.organization}`);
    }

    return result;
  }
}
