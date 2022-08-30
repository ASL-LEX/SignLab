import { Injectable } from '@angular/core';
import { User } from 'shared/dtos/user.dto';
import { SignLabHttpClient } from './http.service';

/**
 * This service provides the ability to interact with user information
 * that may be stored on the server
 */
@Injectable()
export class UserService {
  constructor(private signLab: SignLabHttpClient) {}

  /**
   * Get back all of the users. If the result is malformed or no users are in
   * the system, then the result will be an empty list.
   *
   * @return The list of users in the system
   */
  async getUsers(): Promise<User[]> {
    return this.signLab.get<User[]>('api/users');
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
  async changeRole(
    user: User,
    role: string,
    hasRole: boolean
  ): Promise<boolean> {
    const targetURL = `api/users/${role}/${user._id}`;

    // Try to make the change
    try {
      if (hasRole) {
        await this.signLab.put<any>(targetURL, null);
      } else {
        await this.signLab.delete<any>(targetURL);
      }
      return true;
    } catch (error) {
      console.log('Failed to update the user role');
      console.log(error);
      return false;
    }
  }
}