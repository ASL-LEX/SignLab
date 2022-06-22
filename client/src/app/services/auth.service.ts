import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

interface UserCredentials {
  authHeader: string;
  user: User;
}

/**
 * This handles the user level authentication logic. This exposes an interface
 * for authenticating the user and logging the user out.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  /** The logged in user information, or null if the user isn't authenticated */
  userCredentials: UserCredentials | null;

  /**
   * Make a new instance of the authentication service.
   */
  constructor(private http: HttpClient) {
    this.userCredentials = null;
  }


  /**
   * Determine if the user is currently authenticated.
   *
   * @return True if the system is currently authenticated
   */
  public isAuthenticated(): boolean {
    return this.userCredentials != null;
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
      const response = await this.http.post<UserCredentials>(`http://localhost:9000/api/login`, credentials, {}).toPromise();

      // If the object is invalid, assumed failed login attempt
      if(response === undefined) {
        console.error("Invalid login reponse");
        return null;
      }

      // Store the authorization information and return the user
      this.userCredentials = response;
      return response.user;
    } catch(error) {
      console.debug(`Failed to authenticate user`);
      return null;
    }
  }

  /**
   * Sign out of the system.
   */
  public async signOut() {
    // TODO: Implement sign out logic
  }
}
