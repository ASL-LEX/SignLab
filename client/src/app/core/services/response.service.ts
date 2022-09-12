import { Injectable } from '@angular/core';
import { SaveAttempt, Response } from 'shared/dtos/response.dto';
import { ResponseStudy } from 'shared/dtos/responsestudy.dto';
import { Tag } from 'shared/dtos/tag.dto';
import { Study } from 'shared/dtos/study.dto';
import { User } from 'shared/dtos/user.dto';
import { SignLabHttpClient } from './http.service';
import { MetadataDefinition } from 'shared/dtos/response.dto';

/**
 * Handle access and modifications make to responses.
 */
@Injectable()
export class ResponseService {
  constructor(private signLab: SignLabHttpClient) {}

  /**
   * Set the metadata that all responses will be expected to have.
   */
  async setMetadata(definitions: MetadataDefinition[]) {
    this.signLab.post<any>('api/response/metadata', definitions, {
      provideToken: true,
    });
  }

  /**
   * Get all responses.
   *
   * @return List of responses
   */
  async getResponses(): Promise<Response[]> {
    return this.signLab.get<Response[]>('api/response/', {
      provideToken: true,
    });
  }

  /**
   * Get all responses with the cooresponding information about how the
   * response is used in a study.
   */
  async getResponseStudies(studyID: string): Promise<ResponseStudy[]> {
    return this.signLab.get<ResponseStudy[]>('api/response/responsestudies', {
      params: { studyID: studyID },
      provideToken: true,
    });
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

    return this.signLab.post<SaveAttempt>('api/response/upload/csv', form, {
      provideToken: true,
    });
  }

  /**
   * Upload ZIP which has all of the new response videos in it
   */
  async uploadZIP(file: File): Promise<SaveAttempt> {
    const form = new FormData();
    form.append('file', file);

    return this.signLab.post<SaveAttempt>('api/response/upload/zip', form, {
      provideToken: true,
    });
  }

  /**
   * Get the next response that needs to be tagged. This will return an
   * incomplete tag for the user to complete.
   */
  async getNextUntaggedResponse(
    user: User,
    study: Study,
    isTraining: boolean
  ): Promise<Tag | null> {
    const query = {
      params: { userID: user._id, studyID: study._id! },
      provideToken: true,
    };

    if (isTraining) {
      return this.signLab.get<Tag | null>('api/tag/nextTraining', query);
    } else {
      return this.signLab.get<Tag | null>('api/tag/assign', query);
    }
  }

  /**
   * Attempt to apply the given tag to the associated response.
   *
   * @param tag The tag that is being applied
   * @return Success or error
   */
  async addTag(tag: Tag, isTraining: boolean): Promise<void> {
    if (isTraining) {
      return this.signLab.post<any>('api/tag/completeTraining', tag, {
        provideToken: true,
      });
    } else {
      return this.signLab.post<any>('api/tag/complete', tag, {
        provideToken: true,
      });
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
  async setUsedInStudy(
    responseID: string,
    usedInStudy: boolean,
    studyID: string
  ): Promise<boolean> {
    const targetURL = 'api/response/enable';
    const requestBody = {
      responseID: responseID,
      studyID: studyID,
      isPartOfStudy: usedInStudy,
    };
    try {
      await this.signLab.put<any>(targetURL, requestBody, {
        provideToken: true,
      });
    } catch (error) {
      console.debug('Failed to update the user role');
      return false;
    }
    return true;
  }
}
