import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserAvailability, UserCredentials, UserIdentification, UserSignup } from 'shared/dtos/user.dto';
import { AuthResponse, TokenPayload } from 'shared/dtos/auth.dto';
import { hash, compare } from 'bcrypt';
import * as usercredentials from '../auth/usercredentials.schema';
import { UserService } from '../user/user.service';
import { User } from 'shared/dtos/user.dto';

/**
 * Handles authentication level logic. This involves checking user credentials
 * when logging in and handling new user signup.
 */
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(usercredentials.UserCredentials.name)
    private userCredentialsModel: Model<usercredentials.UserCredentialsDocument>,
    private userService: UserService
  ) {}

  /**
   * Attempt to authenticate the given user based on username and password.
   *
   * @return The authenticated user on success, null otherwise
   */
  public async authenticate(credentials: UserCredentials): Promise<AuthResponse | null> {
    // Attempt to get the user from the database
    const userCredentials = await this.userCredentialsModel
      .findOne({
        username: credentials.username
      })
      .exec();
    const user = await this.userService.findOne({
      username: credentials.username
    });

    // If a user is not found with that username, return null
    if (userCredentials === null || user === null) {
      return null;
    }

    // Check password
    if (await compare(credentials.password, userCredentials.password)) {
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
  public async availability(userId: UserIdentification): Promise<UserAvailability> {
    const availability = { username: true, email: true };

    // Check username availability
    let user = await this.userService.findOne({ username: userId.username });
    if (user) {
      availability.username = false;
    }

    // Check email availability
    user = await this.userService.findOne({ email: userId.email });
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
      roles: {
        owner: isOwner,
        projectAdmin: {},
        studyAdmin: {},
        studyContributor: {},
        studyVisible: {}
      }
    };

    const userCredentials = {
      username: userSignup.username,
      password: hashedPassword
    };

    const newUser = await this.userService.create(user);
    await this.userCredentialsModel.create(userCredentials);
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
