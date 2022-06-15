import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


/**
 * This handles the user level authentication logic. This exposes an interface
 * for authenticating the user and logging the user out.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** The authenticated user, null before authentication has taken place */
  private authUser: firebase.User | null;
  /** The firebase authentication interface to authenticate against */
  private afAuth: AngularFireAuth;

  /**
   * Make a new instance of the authentication service.
   *
   * @param afAuth The firebase athentication interface
   */
  constructor(afAuth: AngularFireAuth) {
    this.authUser = null;
    this.afAuth = afAuth;
  }


  /**
   * Determine if the user is currently authenticated.
   *
   * @return True if the system is currently authenticated
   */
  public isAuthenticated(): boolean {
    return this.authUser != null;
  }

  /**
   * Autheticate the user using the email and password. This will authenticate
   * against the Firebase Auth system.
   *
   * @param email The email to authenticate with as plain text. It is expected
   *              that the email is stripped of whitespace and an exact match
   *              to the intended email.
   * @param password The password to authenticate the user with
   * @return The user ID on success, null otherwise
   */
  public async authenticate(email: string, password: string): Promise<string | null> {
    // Attempt to authenticate, will error out on failure
    try {
      const userCredentials =
        await this.afAuth.signInWithEmailAndPassword(email, password);
      this.authUser = userCredentials.user;
      return this.authUser?.uid ?? null; // Authentication successful
    } catch(error) {
      console.debug(`Failed to authenticate with Firebase
                     Authentication Error: ${error}`);
      return null; // Authentication failed
    }
  }

  /**
   * Sign out of the system.
   */
  public async signOut() {
    if(this.authUser) {
      await this.afAuth.signOut();
      this.authUser = null;
    }
  }
}
