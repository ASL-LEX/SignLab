import { Injectable } from '@angular/core';
import { SignLabHttpClient } from './http.service';

/**
 * The backend service handles meta-level information about the application
 * itself. This is information that relates more to the functionality of the
 * web application as a web application rather then business level knowledge.
 */
@Injectable()
export class BackendService {
  constructor(private signLab: SignLabHttpClient) {}

  /**
   * Determine if the application is in the "first time setup mode" or not.
   */
  async isInFirstTimeSetup(): Promise<boolean> {
    const result = await this.signLab.get<{ isFirstTimeSetup: boolean }>(
      'api/first'
    );
    return result.isFirstTimeSetup;
  }
}
