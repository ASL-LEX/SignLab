import { Injectable } from '@angular/core';
import { Tag } from 'shared/dtos/tag.dto';
import { SignLabHttpClient } from '../../core/services/http.service';

/**
 * Service to upload video tag fields to the server
 */
@Injectable()
export class VideoTagUploadService {
  constructor(private signLab: SignLabHttpClient) {}

  /**
   * Upload the video field related to the provided tag
   */
  async uploadVideo(
    tag: Tag,
    video: Blob,
    fieldName: string,
    datasetID: string
  ): Promise<string> {
    // Make a file from the blob
    // TODO: Check file type
    const file = new File([video], 'video.mp4', { type: 'video/mp4' });

    // Construct the form with the file and associated data
    const formParams = new FormData();
    formParams.append('file', file);
    formParams.append('tag', JSON.stringify(tag));
    formParams.append('field', fieldName);
    formParams.append('datasetID', datasetID);

    // Submit the form
    return (
      await this.signLab.post<{ uri: string }>(
        '/api/tag/video_field',
        formParams
      )
    ).uri;
  }
}
