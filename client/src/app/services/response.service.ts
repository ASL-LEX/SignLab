import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../models/response';
import { SaveAttempt } from '../../../../shared/dtos/response.dto';
import { Tag } from '../../../../shared/dtos/tag.dto';
import {MetaDefinition} from '@angular/platform-browser';


/**
 * Handle access and modifications make to responses.
 */
@Injectable({ providedIn: 'root' })
export class ResponseService {
  constructor(private http: HttpClient) { }

  /**
   * Set the metadata that all responses will be expected to have.
   */
  async setMetadata(definitions: MetaDefinition[]) {
    const result =
      await this.http.post<any>(`http://localhost:3000/api/response/metadata`,
                                 definitions).toPromise();
  }

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

  /**
   * Get the next response that needs to be tagged. This will return an
   * incomplete tag for the user to complete.
   */
  async getNextUntaggedResponse(): Promise<Tag | null> {
    // TODO: Determine the current user
    const result  = await this.http.get<Tag | null>(`http://localhost:3000/api/response/assign?userID=62d1c3a08bad2d53bbe331c7&studyID=62dae1bef7ba9a50a2a33bdc`).toPromise();

    return result ? result : null;
  }

  /**
   * Attempt to apply the given tag to the associated response.
   *
   * @param tag The tag that is being applied
   * @return Success or error
   */
  async addTag(tag: Tag) {
    const response = await this.http.post<any>(`http://localhost:3000/api/response/tag`, tag, {}).toPromise();
  }
}
