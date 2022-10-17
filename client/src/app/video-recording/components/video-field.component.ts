import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { Component, OnInit } from '@angular/core';
import {
  composeWithUi,
  RankedTester,
  rankWith,
  Actions,
} from '@jsonforms/core';
import { VideoTagUploadService } from '../services/video-tag-upload.service';
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
    const uri = await this.videoUpload.uploadVideo(this.tagService.current, videoBlob, fieldName);

    console.log(uri);

    // Update the value of the form to be the URI of the video
    const path = composeWithUi(this.uischema, this.path);
    this.jsonFormsService.updateCore(Actions.update(path, () => uri));
    this.triggerValidation();
  }

  ngOnInit(): void {
    super.ngOnInit();
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
