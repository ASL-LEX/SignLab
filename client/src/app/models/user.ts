/**
 * Represents the active user of this platform. This user object keeps track
 * of the details that are needed when the user is logged into the application
 */
export interface User {
  email: string;
  name: string;
  roles: string[];
  username: string;
  _id: string;
}
