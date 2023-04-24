import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenPayload } from './dtos/token-payload.dto';
import { hash, compare } from 'bcrypt';
import * as usercredentials from '../auth/usercredentials.schema';
import { UserService } from '../user/user.service';
import { AuthResponse } from './dtos/auth-response.dto';
import { UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';
import { ComplexityOptions } from 'joi-password-complexity';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.schema';
import { UserCredentials } from '../auth/usercredentials.schema';
import { UserSignup } from './dtos/user-signup.dto';
import { UserAvailability } from './dtos/user-availability.dto';
import { UserIdentification } from './dtos/user-identification.dto';

/**
 * Handles authentication level logic. This involves checking user credentials
 * when logging in and handling new user signup.
 */
@Injectable()
export class AuthService {
  passwordComplexity: ComplexityOptions;

  constructor(
    private jwtService: JwtService,
    @InjectModel(usercredentials.UserCredentials.name)
    private userCredentialsModel: Model<usercredentials.UserCredentialsDocument>,
    private userService: UserService,
    private readonly configService: ConfigService
  ) {
    this.passwordComplexity = this.configService.getOrThrow('auth.passwordComplexity');
  }

  /**
   * Attempt to authenticate the given user based on username and password.
   *
   * @return The authenticated user on success, null otherwise
   */
  public async authenticate(credentials: UserCredentials): Promise<AuthResponse> {
    // Attempt to get the user from the database
    const userCredentials = await this.userCredentialsModel
      .findOne({
        username: credentials.username,
        organization: credentials.organization
      })
      .exec();
    const user = await this.userService.findOne({
      username: credentials.username,
      organization: credentials.organization
    });

    // If a user is not found with that username, return null
    if (userCredentials === null || user === null) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Check password
    if (await compare(credentials.password, userCredentials.password)) {
      return { user: new mongoose.Types.ObjectId(user._id), token: this.generateToken(user) };
    } else {
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  /**
   * Check to see if the given username and email are available. Will return
   * availabiliy info for both username and email
   *
   * TODO: Make sure that the organization exists
   *
   * @return The availability of the username and email
   */
  public async availability(userId: UserIdentification): Promise<UserAvailability> {
    const availability = { username: true, email: true };

    // Check username availability
    let user = await this.userService.findOne({ username: userId.username, organization: userId.organization });
    if (user) {
      availability.username = false;
    }

    // Check email availability
    user = await this.userService.findOne({ email: userId.email, organization: userId.organization });
    if (user) {
      availability.email = false;
    }

    return availability;
  }

  /**
   * Will add in a new user with the given user information.
   *
   * @return The newly created user.
   */
  public async signup(userSignup: UserSignup): Promise<AuthResponse> {
    // First user is always the owner
    const numUsers = await this.userService.count();
    const isOwner = numUsers == 0;

    const hashedPassword = await hash(userSignup.password, 10);

    const user = {
      username: userSignup.username,
      email: userSignup.email,
      name: userSignup.name,
      organization: userSignup.organization,
      roles: {
        owner: isOwner,
        projectAdmin: new Map<string, boolean>(),
        studyAdmin: new Map<string, boolean>(),
        studyContributor: new Map<string, boolean>(),
        studyVisible: new Map<string, boolean>()
      }
    };

    const userCredentials = {
      username: userSignup.username,
      password: hashedPassword,
      organization: userSignup.organization
    };

    const newUser = await this.userService.create(user);
    await this.userCredentialsModel.create(userCredentials);
    return { user: new mongoose.Types.ObjectId(newUser._id), token: this.generateToken(newUser) };
  }

  /**
   * Check to see if a user is authorized based on a list of acceptable roles.
   * A user is considered authorized if it has at least one of the necessary
   * roles.
   *
   * @param user The user to find
   * @param roles List of roles (as strings)
   * @return True if the user is authorized, false otherwise
   */
  public async isAuthorized(user: User, roles: string[]): Promise<boolean> {
    // Owner can do anything
    if (user.roles.owner) {
      return true;
    }

    // Check all roles
    for (const role of roles) {
      if ((user.roles as any)[role]) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generate a token for a given user
   */
  private generateToken(user: User): string {
    const tokenPayload: TokenPayload = { _id: user._id, roles: user.roles, organization: user.organization };
    return this.jwtService.sign(tokenPayload);
  }
}
