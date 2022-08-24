import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserAvailability } from '../../../../../shared/dtos/user.dto';
import{ ComplexityOptions } from 'joi-password-complexity';


/**
 * This handles the user level authentication logic. This exposes an interface
 * for authenticating the user and logging the user out.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  /** The logged in user information, or null if the user isn't authenticated */
  currentUser: User | null

  /**
   * Make a new instance of the authentication service.
   */
  constructor(private http: HttpClient) {
    this.currentUser = null;
  }


  /**
   * Determine if the user is currently authenticated.
   *
   * @return True if the system is currently authenticated
   */
  public isAuthenticated(): boolean {
    return this.currentUser != null;
  }

  /**
   * Get the current user. If there is no logged in user, this will throw
   * an error.
   */
  get user(): User {
    if(!this.isAuthenticated()) {
      throw new Error('No authenticated user');
    } else {
      return this.currentUser!;
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
  public async authenticate(username: string, password: string): Promise<User | null> {
    // Attempt to authenticate against Anchor's authentication API
    // TODO: Find way of inserting the correct URL
    const credentials = { username: username, password: password };

    try {
      const response = await this.http.post<User>(`http://localhost:3000/api/auth/login`, credentials, {}).toPromise();

      // If the object is invalid, assumed failed login attempt
      if(response === undefined) {
        console.error("Invalid login reponse");
        return null;
      }

      // Store the authorization information and return the user
      this.currentUser = response;
      return response;
    } catch(error) {
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
    const result = await this.http.get<ComplexityOptions>(`http://localhost:3000/api/auth/complexity`).toPromise();

    // Throw an error if the response does not come back with the requirements
    if(!result) {
      throw new Error('Failed to get password requirements from server');
    }
    return result;
  }

  /**
   * Check to see if the given username and email combination is available
   *
   * @param username The username to check the availability of
   * @param email The email to check the availability of
   * @return Availability info
   */
  public async isUserAvailable(username: string, email: string): Promise<UserAvailability> {
    const options = { params: { username: username, email: email } };
    const result =
      await this.http.get<UserAvailability>(`http://localhost:3000/api/auth/availability`, options).toPromise();
    if(!result) {
      throw new Error('Failed to get user availability information');
    }

    return result;
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
  public async signup(name: string, email: string, username: string, password: string): Promise<User> {
    const request = {
      name: name,
      email: email,
      username: username,
      password: password
    };
    const result = await this.http.post<User>(`http://localhost:3000/api/auth/signup`, request).toPromise();
    if(!result) {
      throw new Error(`Failed to signup user`);
    }
    return result;
  }

  /**
   * Sign out of the system.
   */
  public async signOut() {
    // TODO: Implement sign out logic
  }
}
