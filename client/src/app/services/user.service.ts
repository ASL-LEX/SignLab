import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from './auth.service';

/**
 * This service handles the application wide access to the logged in user.
 * This service contains the ability to pull user data from a database and
 * store that user data for application wide usage.
 *
 * The general work flow is the application uses this service to login
 * where this service then authenticates the credentials against the auth
 * service. Then this service gains additional details regarding the user
 * from the application level database. The collected details on the user
 * is then exposed via this service.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  /** The user of the application, null until the user logs in */
  private user: User | null;

  constructor(private authService: AuthService) { }
}
