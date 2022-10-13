import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VideoFieldComponent } from './components/video-field.component';
import { VideoRecordComponent } from './components/video-record.component';
import { VideoTagUploadService } from './services/video-tag-upload.service';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    VideoRecordComponent,
    VideoFieldComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    VideoRecordComponent,
    VideoFieldComponent,
  ],
  providers: [
    VideoTagUploadService
  ]
})
export class VideoRecordingModule {}
