import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../models/response';
import { SaveAttempt } from '../../../../shared/dtos/response.dto';


/**
 * Handle access and modifications make to responses.
 */
@Injectable({ providedIn: 'root' })
export class ResponseService {
  constructor(private http: HttpClient) { }

  /**
   * Get all responses.
   *
   * @return List of responses
   */
  async getResponses(): Promise<Response[]> {
    const result = await this.http.get<Response[]>(`http://localhost:3000/api/response/`).toPromise();
    if (!result) {
      return [];
    }
    return result;
  }

  /**
   * Upload the CSV that containes information on new responses
   *
   * @param file The file to upload
   */
  async uploadCSV(file: File): Promise<SaveAttempt> {
    // Make the post form
    const form = new FormData();
    form.append('file', file);

    const result = await this.http.post<any>(`http://localhost:3000/api/response/upload/csv`, form).toPromise();

    if (!result) {
      return { type: 'error', message: 'Unknown error' };
    }
    return result;
  }

  /**
   * Upload ZIP which has all of the new response videos in it
   */
  async uploadZIP(file: File): Promise<SaveAttempt> {
    const form = new FormData();
    form.append('file', file);

    const result = await this.http.post<SaveAttempt>(`http://localhost:3000/api/response/upload/zip`, form).toPromise();

    if(!result) {
      return { type: 'error', message: 'Uknown error' };
    }
    return result;
  }
}
