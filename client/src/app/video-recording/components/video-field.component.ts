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
        <mat-panel-title>
          {{ label }} - Video Recording
        </mat-panel-title>
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

  constructor(
    jsonFormsService: JsonFormsAngularService,
    private videoUpload: VideoTagUploadService,
    private tagService: TagService
  ) {
    super(jsonFormsService);
  }

  async saveVideo(videoBlob: Blob): Promise<void> {
    // Get the fieldname from the uischema
    const fieldName = this.uischema.scope.slice(this.uischema.scope.lastIndexOf('/') + 1);
    VideoTagUploadService

    // Upload the video to the backend
    const uri = await this.videoUpload.uploadVideo(this.tagService.current, videoBlob, fieldName);

    // Update the value of the form to be the URI of the video
    const path = composeWithUi(this.uischema, this.path);
    this.jsonFormsService.updateCore(Actions.update(path, () => uri));
    this.triggerValidation();
  }

  ngOnInit(): void {
    super.ngOnInit();

    // Get the dataset ID from the schema
    if (this.uischema.options != undefined && this.uischema.options.dataset != undefined) {
      this.datasetID = this.uischema.options.dataset;
      console.log(this.datasetID);
    } else {
      console.error('No dataset ID provided for video field');
    }
  }
}

export const videoFieldTester: RankedTester = rankWith(
  10,
  (uischema, _schema, _rootSchema) => {
    return (
      uischema.options != undefined &&
      uischema.options.customType === 'video'
    );
  }
);
