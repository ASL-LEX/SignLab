import { Injectable } from '@angular/core';
import { User, UserAvailability } from 'shared/dtos/user.dto';
import { AuthResponse } from 'shared/dtos/auth.dto';
import { ComplexityOptions } from 'joi-password-complexity';
import { SignLabHttpClient } from './http.service';

/**
 * This handles the user level authentication logic. This exposes an interface
 * for authenticating the user and logging the user out.
 */
@Injectable()
export class AuthService {
  AUTH_RESPONSE_KEY = 'SIGNLAB_AUTH_INFO';

  /** Information on the logged in user */
  authInformation: AuthResponse | null = null;

  /**
   * Make a new instance of the authentication service.
   */
  constructor(private signLab: SignLabHttpClient) {
    this.loadCredentials();
  }

  /**
   * Determine if the user is currently authenticated.
   *
   * @return True if the system is currently authenticated
   */
  public isAuthenticated(): boolean {
    // TODO: Check for expiration of JWT token
    return this.authInformation != null;
  }

  /**
   * Get the current user. If there is no logged in user, this will throw
   * an error.
   */
  get user(): User {
    if (!this.isAuthenticated()) {
      throw new Error('No authenticated user');
    } else {
      return this.authInformation!.user;
    }
  }

  /**
   * Autheticate the user using the username and password. This will authenticate
   * against the Anchor backend
   *
   * @param username The username to authenticate with as plain text. It is
   *                 expected that the username is stripped of whitespace and
   *                 an exact match to the intended username.
   * @param password The password to authenticate the user with
   * @return The user ID on success, null otherwise
   */
  public async authenticate(
    username: string,
    password: string
  ): Promise<User | null> {
    const credentials = { username: username, password: password };

    try {
      const response = await this.signLab.post<AuthResponse>(
        'api/auth/login',
        credentials,
        {}
      );

      this.storeCredentials(response);
      return this.authInformation!.user;
    } catch (error) {
      console.debug(`Failed to authenticate user`);
      return null;
    }
  }

  /**
   * Get the password complexity requirements. These are the requirements that
   * must be meet for the password to be considered valid.
   *
   * NOTE: Currently this works by getting the password complexity from the
   *       server and wraps up the data as an object. Ideally this may be done
   *       with some shared schema. Or this request should instead check the
   *       complexity of the password and return any error message to the
   *       user
   *
   * @return Password complexity requirements
   */
  public async getPasswordComplexity(): Promise<ComplexityOptions> {
    return this.signLab.get<ComplexityOptions>('api/auth/complexity');
  }

  /**
   * Check to see if the given username and email combination is available
   *
   * @param username The username to check the availability of
   * @param email The email to check the availability of
   * @return Availability info
   */
  public async isUserAvailable(
    username: string,
    email: string
  ): Promise<UserAvailability> {
    const options = { params: { username: username, email: email } };
    return this.signLab.get<UserAvailability>('api/auth/availability', options);
  }

  /**
   * Attempt to signup the given user. Will throw an error on failure. On
   * success will return the newly created user.
   *
   * NOTE: This throws an error since all other validation should be handled
   *       before this point. Therefore any error thrown should be unexpected.
   *
   * @param name The name of the new user
   * @param email The email of the new user
   * @param username The username of the new user
   * @param password The password the user will use
   * @return The newly created user
   */
  public async signup(
    name: string,
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    const request = {
      name: name,
      email: email,
      username: username,
      password: password,
    };
    const result = await this.signLab.post<AuthResponse>('api/auth/signup', request);

    this.storeCredentials(result);

    return result.user;
  }

  /**
   * Sign out of the system.
   */
  public async signOut() {
    // TODO: Implement sign out logic
  }

  /**
   * Locally store credential information to reduce having to login when
   * returning to the site.
   */
  private storeCredentials(authResponse: AuthResponse): void {
    // Add to local storage
    localStorage.setItem(this.AUTH_RESPONSE_KEY, JSON.stringify(authResponse));

    // Update in memory authenticate information
    this.authInformation = authResponse;
  }

  /**
   * Attempt to load credentials from local storage
   */
  private loadCredentials(): void {
    const storedValue = localStorage.getItem(this.AUTH_RESPONSE_KEY);
    this.authInformation = storedValue ? JSON.parse(storedValue) : null;
  }
}
