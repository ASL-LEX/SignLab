import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';


/**
 * This service provides the ability to interact with user information
 * that may be stored on the server
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  /**
   * Get back all of the users. If the result is malformed or no users are in
   * the system, then the result will be an empty list.
   *
   * @return The list of users in the system
   */
  async getUsers(): Promise<User[]> {
    const response = await this.http.get<User[]>(`http://localhost:3000/api/users`).toPromise();

    // If no response received, return empty list
    if(!response) {
      return [];
    }

    return response;
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
    const targetURL = `http://localhost:3000/api/users/${role}/${user._id}`;

    // Try to make the change
    try {
      if(hasRole) {
        await this.http.put<any>(targetURL, null).toPromise();
      } else {
        await this.http.delete<any>(targetURL).toPromise();
      }
      return true;
    } catch(error) {
      console.log('Failed to update the user role');
      console.log(error);
      return false;
    }
  }
}
