import { Injectable } from '@angular/core';
import { SignLabHttpClient } from './http.service';
import { TokenService } from './token.service';
import { Apollo } from 'apollo-angular';
import { LoginGQL, SignupGQL } from '../../graphql/auth/auth.generated';
import { firstValueFrom } from 'rxjs';
import { User } from '../../graphql/graphql';

/**
 * This handles the user level authentication logic. This exposes an interface
 * for authenticating the user and logging the user out.
 */
@Injectable()
export class AuthService {
  /**
   * Make a new instance of the authentication service.
   */
  constructor(
    private signLab: SignLabHttpClient,
    private tokenService: TokenService,
    private apollo: Apollo,
    private readonly signupGQL: SignupGQL,
    private readonly loginGQL: LoginGQL
  ) {
    // Update stored user information in case the roles have changes
    if (this.isAuthenticated()) {
      this.signLab.get('api/users/me', { provideToken: true }).then((user: any) => {
        this.tokenService.updateUser(user);
      });
    }
  }

  /**
   * Determine if the user is currently authenticated.
   *
   * @return True if the system is currently authenticated
   */
  public isAuthenticated(): boolean {
    return this.tokenService.hasAuthInfo();
  }

  /**
   * Get the current user. If there is no logged in user, this will throw
   * an error.
   */
  get user(): User {
    if (!this.isAuthenticated()) {
      throw new Error('No authenticated user');
    } else {
      return this.tokenService.user!;
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
    const credentials = { username: username, password: password };

    try {
      const response = await firstValueFrom(this.loginGQL.mutate({ credentials: credentials }));

      this.tokenService.storeAuthInformation(response.data!.login);

      // Refetch queries to update having an active user
      this.apollo.client.resetStore();

      return this.user;
    } catch (error) {
      console.debug(error);
      console.debug(`Failed to authenticate user`);
      return null;
    }
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
      credentials: {
        name: name,
        email: email,
        username: username,
        password: password
      }
    };

    const result = await firstValueFrom(this.signupGQL.mutate(request));
    this.tokenService.storeAuthInformation(result.data!.signup);

    return result.data!.signup.user;
  }

  /**
   * Sign out of the system.
   */
  public async signOut() {
    this.tokenService.removeAuthInformation();
  }
}
