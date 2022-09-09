import { Injectable } from '@angular/core';
import { AuthResponse } from 'shared/dtos/auth.dto';
import { User } from 'shared/dtos/user.dto';

/**
 * Handles storage and access of the authentication information. The user and
 * cooresponding token is kept in local storage.
 */
@Injectable()
export class TokenService {
  AUTH_RESPONSE_KEY = 'SIGNLAB_AUTH_INFO';

  /** Value loaded from local storage */
  private authInformation: AuthResponse | null;

  constructor() {
    this.authInformation = this.loadCredentials();
  }

  get user(): User | null {
    return this.authInformation ? this.authInformation.user : null
  }

  get token(): string | null {
    return this.authInformation ? this.authInformation.token : null;
  }

  storeAuthInformation(authInformation: AuthResponse): AuthResponse {
    this.storeCredentials(authInformation);
    this.authInformation = authInformation;
    return this.authInformation;
  }

  /**
   * Check to see if there is authentication information stored
   */
  hasAuthInfo(): boolean {
    return this.authInformation != null;
  }

  /**
   * Try to load the credentials from storage, if nothing is present, returns
   * null.
   */
  private loadCredentials(): AuthResponse | null {
    const storedValue = localStorage.getItem(this.AUTH_RESPONSE_KEY);
    return storedValue ? JSON.parse(storedValue) : null;
  }

  /**
   * Store the credentials in local storage.
   */
  private storeCredentials(authResponse: AuthResponse): void {
    localStorage.setItem(this.AUTH_RESPONSE_KEY, JSON.stringify(authResponse));
  }
}
