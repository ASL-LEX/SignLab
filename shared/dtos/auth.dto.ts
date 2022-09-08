import { User } from './user.dto';

/**
 * The response that is returned from the server once authentication takes
 * place.
 */
export interface AuthResponse {
  /** The user that was authenticated */
  user: User;
  /** JWT token to all other calls */
  token: string;
}
