import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveAttempt, Response } from '../../../../../shared/dtos/response.dto';
import { ResponseStudy } from '../../../../../shared/dtos/responsestudy.dto';
import { Tag } from '../../../../../shared/dtos/tag.dto';
import { MetaDefinition } from '@angular/platform-browser';
import { Study } from '../../../../../shared/dtos/study.dto';
import { User } from '../../../../../shared/dtos/user.dto';

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
   * Get all responses with the cooresponding information about how the
   * response is used in a study.
   */
  async getResponseStudies(studyID: string): Promise<ResponseStudy[]> {
    const result = await this.http.get<ResponseStudy[]>(`http://localhost:3000/api/response/responsestudies`, { params: { 'studyID': studyID } }).toPromise();

    if(!result) {
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
  async getNextUntaggedResponse(user: User, study: Study, isTraining: boolean): Promise<Tag | null> {
    // TODO: Determine the current user
    let result = null;

    const query = { params: { userID: user._id, studyID: study._id! } };

    if(isTraining) {
      result = await this.http.get<Tag | null>(`http://localhost:3000/api/tag/nextTraining`, query).toPromise();
    } else {
      result = await this.http.get<Tag | null>(`http://localhost:3000/api/tag/assign`, query).toPromise();
    }

    return result ? result : null;
  }

  /**
   * Attempt to apply the given tag to the associated response.
   *
   * @param tag The tag that is being applied
   * @return Success or error
   */
  async addTag(tag: Tag, isTraining: boolean) {
    if(isTraining) {
      await this.http.post<any>(`http://localhost:3000/api/tag/completeTraining`, tag, {}).toPromise();
    } else {
      await this.http.post<any>(`http://localhost:3000/api/tag/complete`, tag, {}).toPromise();
    }
  }

  /**
   * Change the enable state of a response for given study.
   *
   * @param responseID The response to change th    const params = e enable state of
   * @param usedInStudy If the response should be included in the tagging
   *                    portion of the study or not
   * @param studyID The ID of the study that this is being applied to
   * @return True if the change took place successfully
   */
  async setUsedInStudy(responseID: string, usedInStudy: boolean, studyID: string): Promise<boolean> {
    const targetURL = `http://localhost:3000/api/response/enable`;
    const requestBody = { responseID: responseID, studyID: studyID, isPartOfStudy: usedInStudy };
    try {
      await this.http.put<any>(targetURL, requestBody).toPromise();
    } catch(error) {
      console.log('Failed to update the user role');
      return false;
    }
    return true;
  }
}
