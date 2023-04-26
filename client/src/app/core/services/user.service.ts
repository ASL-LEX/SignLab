import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SignLabHttpClient } from './http.service';
import { User } from '../../graphql/graphql';

/**
 * This service provides the ability to interact with user information
 * that may be stored on the server
 */
@Injectable()
export class UserService {
  constructor(private signLab: SignLabHttpClient, private authService: AuthService) {}

  /**
   * Get back all of the users. If the result is malformed or no users are in
   * the system, then the result will be an empty list.
   *
   * @return The list of users in the system
   */
  async getUsers(organization: string): Promise<User[]> {
    return this.signLab.get<User[]>('api/users', { provideToken: true, params: { 'organization': organization } });
  }

  /**
   * Update a single user in the database. Will return true on success, false
   * if the user role could not be updated.
   *
   * @param user The user to update
   * @param role The role to change the state of
   * @param hasRole If the user will have the given role
   * @return True on success, false otherwise
   */
  async changeRole(user: User, role: string, hasRole: boolean): Promise<boolean> {
    const targetURL = `api/users/${role}/${user._id}`;

    // Try to make the change
    try {
      if (hasRole) {
        await this.signLab.put<any>(targetURL, {}, { provideToken: true });
      } else {
        await this.signLab.delete<any>(targetURL, { provideToken: true });
      }
      return true;
    } catch (error) {
      console.log('Failed to update the user role');
      console.log(error);
      return false;
    }
  }

  /**
   * Transfer ownership from the current user to the selected user.
   * At this point the user logged in will no longer be an owner
   */
  async transferOwnership(newOwner: User) {
    const currentUser = this.authService.user;

    const requestBody = {
      originalID: currentUser._id,
      newOwnerID: newOwner._id
    };

    this.signLab.post<any>('api/users/owner/transfer', requestBody, {
      provideToken: true
    });
  }

  /**
   * Add the provided user as a new owner
   */
  async addOwner(newOwner: User) {
    this.signLab.post<any>(`api/users/owner/add/${newOwner._id}`, {}, { provideToken: true });
  }

  /**
   * Get information on the number of owner accounts
   */
  async getOwnerInfo(): Promise<{ numberOfOwners: number; maxOwnerAccounts: number }> {
    return this.signLab.get<any>('api/users/owner/info', { provideToken: true });
  }
}
