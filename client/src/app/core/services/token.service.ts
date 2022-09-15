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
    return this.authInformation ? this.authInformation.user : null;
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
   * Remove the stored authentication information
   */
  removeAuthInformation(): void {
    localStorage.removeItem(this.AUTH_RESPONSE_KEY);
    this.authInformation = null;
  }

  /**
   * Try to load the credentials from storage, if nothing is present, returns
   * null.
   */
  private loadCredentials(): AuthResponse | null {
    const storedValue = localStorage.getItem(this.AUTH_RESPONSE_KEY);

    // If nothing stored, return null
    if (!storedValue) {
      return null;
    }

    const authInformation = JSON.parse(storedValue);

    // If the information has expired, return null
    if (authInformation == null || this.hasJWTTokenExpired(authInformation.token)) {
      return null;
    }
    return authInformation;
  }

  /**
   * Store the credentials in local storage.
   */
  private storeCredentials(authResponse: AuthResponse): void {
    localStorage.setItem(this.AUTH_RESPONSE_KEY, JSON.stringify(authResponse));
  }

  /**
   * Helper function which checks the timestamp of the JWT to see if it
   * has expired.
   *
   * NOTE: Implementation found from the stackoverflow link below
   *       https://stackoverflow.com/a/60758392/6745646
   */
  private hasJWTTokenExpired(token: string) {
    const expiry = JSON.parse(window.atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }
}
