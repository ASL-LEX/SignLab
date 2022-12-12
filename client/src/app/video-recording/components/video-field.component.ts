import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { Component, OnInit } from '@angular/core';
import {
  composeWithUi,
  RankedTester,
  rankWith,
  Actions,
} from '@jsonforms/core';
import { VideoTagUploadService } from '../../core/services/video-tag-upload.service';
import { TagService } from '../../core/services/tag.service';

/**
 * JSON Forms field for a single video. The video will be passed to the backend
 * for storage.
 */
@Component({
  selector: 'video-field',
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title> {{ label }} - Video Recording </mat-panel-title>
        <mat-panel-description>
          {{ description }}
        </mat-panel-description>
      </mat-expansion-panel-header>
      <video-record (videoBlob)="saveVideo($event)"></video-record>
    </mat-expansion-panel>
  `,
})
export class VideoFieldComponent extends JsonFormsControl implements OnInit {
  /** The ID of the dataset that the video is being reocrded for */
  datasetID: string;
  /** The fieldname of the video */
  tagFieldName: string;
  /** Mimumim number of videos that must be recorded */
  minVideos: number;
  /** The upper limit on the number of videos that can be recorded */
  maxVideos: number;

  constructor(
    jsonFormsService: JsonFormsAngularService,
    private videoUpload: VideoTagUploadService,
    private tagService: TagService
  ) {
    super(jsonFormsService);
  }

  /**
   * Save the video to the backend. The video is saved as part of a tag
   * in the context of the field of the tag as well as the video number
   * in that field.
   *
   * ie) For a tag on a study, there can be many fields, each field could
   * require some range of videos to be recorded
   */
  async saveVideo(videoInfo: { videoBlob: Blob, videoNumber: number }): Promise<void> {
    if (!this.tagService.hasCurrentTag()) {
      console.info('No tag selected, not saving video');
      return;
    }

    // Upload the video to the backend
    const uri = await this.videoUpload.uploadVideo(
      this.tagService.current,
      videoInfo.videoBlob,
      this.tagFieldName,
      this.datasetID,
      videoInfo.videoNumber
    );

    // Update the value of the form to be the URI of the video
    const path = composeWithUi(this.uischema, this.path);
    this.jsonFormsService.updateCore(Actions.update(path, () => uri));
    this.triggerValidation();
  }

  ngOnInit(): void {
    super.ngOnInit();

    // Get the dataset ID from the schema
    if (this.uischema.options != undefined) {
      this.datasetID = this.uischema.options.dataset;
      this.minVideos = this.uischema.options.minimumRequired;
      this.maxVideos = this.uischema.options.maximumOptional;
    } else {
      console.error('No dataset ID provided for video field');
    }


    // Get the fieldname from the uischema
    this.tagFieldName = this.uischema.scope.slice(
      this.uischema.scope.lastIndexOf('/') + 1
    );
  }
}

export const videoFieldTester: RankedTester = rankWith(
  10,
  (uischema, _schema, _rootSchema) => {
    return (
      uischema.options != undefined && uischema.options.customType === 'video'
    );
  }
);
