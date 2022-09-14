import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserAvailability,
  UserCredentials,
  UserIdentification,
  UserSignup,
} from 'shared/dtos/user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { AuthResponse, TokenPayload } from 'shared/dtos/auth.dto';

/**
 * Handles authentication level logic. This involves checking user credentials
 * when logging in and handling new user signup.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Attempt to authenticate the given user based on username and password.
   *
   * @return The authenticated user on success, null otherwise
   */
  public async authenticate(
    credentials: UserCredentials,
  ): Promise<AuthResponse | null> {
    // Attempt to get the user from the database
    const user = await this.userModel
      .findOne({ username: credentials.username })
      .exec();

    // If a user is not found with that username, return null
    if (user === null) {
      return null;
    }

    // Check password
    // TODO: Replace with comparing hashed passwords
    if (user.password === credentials.password) {
      return { user: user, token: this.generateToken(user) };
    } else {
      return null;
    }
  }

  /**
   * Check to see if the given username and email are available. Will return
   * availabiliy info for both username and email
   *
   * @return The availability of the username and email
   */
  public async availability(
    userId: UserIdentification,
  ): Promise<UserAvailability> {
    const availability = { username: true, email: true };

    // Check username availability
    let user = await this.userModel
      .findOne({ username: userId.username })
      .exec();
    if (user) {
      availability.username = false;
    }

    // Check email availability
    user = await this.userModel.findOne({ email: userId.email }).exec();
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
    // TODO: Hash password before saving

    // First user is always the owner
    const numUsers = await this.userModel.count();
    const isOwner = numUsers == 0;

    const user = { roles: {} };
    Object.assign(user, userSignup);
    user.roles = {
      admin: isOwner,
      tagging: false,
      recording: false,
      accessing: false,
      owner: isOwner,
    };

    const newUser = await this.userModel.create(user);
    return { user: newUser, token: this.generateToken(newUser) };
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
    const tokenPayload: TokenPayload = { _id: user._id, roles: user.roles };
    return this.jwtService.sign(tokenPayload);
  }
}
