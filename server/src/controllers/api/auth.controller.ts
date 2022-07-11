import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Session,
} from '@nestjs/common';
import { ComplexityOptions } from 'joi-password-complexity';
import { AuthService } from '../../services/auth.service';
import {
  UserAvailability,
  UserCredentials,
  UserIdentification,
  UserSignup,
} from '../../dtos/user.dto';
import { User } from '../../schemas/user.schema';

const passwordValidator = require('joi-password-complexity');

@Controller('/api/auth')
export class AuthController {
  // TODO: Read this in from a config file
  passwordComplexity: ComplexityOptions = {
    min: 4,
    max: 36,
    lowerCase: 1,
    upperCase: 0,
    numeric: 0,
    symbol: 0,
    requirementCount: 3,
  };

  constructor(private authService: AuthService) {}

  /**
   * Endpoint to attempt to login. Logging in will attempt to find the
   * user with the matching username and validate the passwords
   * match.
   *
   * @param userCredentials The credentials to attempt to login with
   * @return The user credentials for the given user on success
   */
  @Post('/login')
  async login(
    @Body() userCredentials: UserCredentials,
    @Session() session: any,
  ): Promise<User | null> {
    const result = await this.authService.authenticate(userCredentials);

    // If the user is valid, update the session with the user ID
    if (result) {
      session.userID = result._id;
    }
    return result;
  }

  /**
   * Get the password complexity requirements. These password complexity
   * requirements are what need to be met for a password to be considered
   * valid/
   */
  @Get('/complexity')
  async getPasswordComplexity(): Promise<ComplexityOptions> {
    return Promise.resolve(this.passwordComplexity);
  }

  /**
   * Endpoint to check if the given user identication elements are available.
   * This can be used to ensure the given username and email are available in
   * the system.
   *
   * @param userId The username and the mail to validate the availability of
   * @return The availability information
   */
  @Get('/availability')
  async userAvailabiliy(
    @Query() userId: UserIdentification,
  ): Promise<UserAvailability> {
    return this.authService.availability(userId);
  }

  /**
   * Sigup the given user.
   *
   * @param userSignup The information needed to signup a new user
   * @return The newly created user
   */
  @Post('/signup')
  async userSignup(@Body() userSignup: UserSignup): Promise<User> {
    // Ensure the user is available, otherwise throw an error
    const availability = await this.authService.availability(userSignup);
    if (!availability.username || !availability.email) {
      throw new HttpException(
        'Username and/or email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Ensure the password complexity is met
    const complexityValidation = passwordValidator(
      this.passwordComplexity,
    ).validate(userSignup.password);
    if (complexityValidation.error) {
      throw new HttpException(
        complexityValidation.error,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.authService.signup(userSignup);
  }
}
