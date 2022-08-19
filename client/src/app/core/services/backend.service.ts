import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * The backend service handles meta-level information about the application
 * itself. This is information that relates more to the functionality of the
 * web application as a web application rather then business level knowledge.
 */
@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(private http: HttpClient) { }

  /**
   * Determine if the application is in the "first time setup mode" or not.
   */
  async isInFirstTimeSetup(): Promise<boolean> {
    const result =
      await this.http.get<{isFirstTimeSetup: boolean}>(`http://localhost:3000/api/first`).toPromise();

    if (!result) {
      return false;
    }
    return result.isFirstTimeSetup;
  }
}
