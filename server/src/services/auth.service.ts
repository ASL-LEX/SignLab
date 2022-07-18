import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserAvailability,
  UserCredentials,
  UserIdentification,
  UserSignup,
} from '../../../shared/dtos/user.dto';
import { User, UserDocument } from '../schemas/user.schema';

/**
 * Handles authentication level logic. This involves checking user credentials
 * when logging in and handling new user signup.
 */
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Attempt to authenticate the given user based on username and password.
   *
   * @return The authenticated user on success, null otherwise
   */
  public async authenticate(
    credentials: UserCredentials,
  ): Promise<User | null> {
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
      return user;
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
  public async signup(userSignup: UserSignup): Promise<User> {
    // TODO: Hash password before saving
    let user = { roles: {} };
    Object.assign(user, userSignup);
    user.roles = {
      admin: false,
      tagging: false,
      recording: false,
      accessing: false,
    };
    return this.userModel.create(user);
  }

  /**
   * Check to see if a user is authorized based on a list of acceptable roles.
   * A user is considered authorized if it has at least one of the necessary
   * roles.
   *
   * @param id The user ID
   * @param roles List of roles (as strings)
   * @return True if the user is authorized, false otherwise
   */
  public async isAuthorized(id: string, roles: string[]): Promise<boolean> {
    // Get the user, if no user, then not authorized
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      return false;
    }

    // Check all roles
    for (const role of roles) {
      if (user.roles[role]) {
        return true;
      }
    }

    return false;
  }
}
