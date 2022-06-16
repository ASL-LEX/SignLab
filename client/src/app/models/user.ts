/**
 * Represents the active user of this platform. This user object keeps track
 * of the details that are needed when the user is logged into the application
 */
export class User {
  /** The unique ID that is used to identify the user in the system */
  uid: string;
  /** The email of the user */
  email: string;

  /**
   * Make a new users instance
   */
  constructor(uid: string, email: string) {
    this.uid = uid;
    this.email = email;
  }
}
