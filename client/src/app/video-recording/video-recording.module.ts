import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VideoFieldComponent } from './components/video-field.component';
import { VideoRecordComponent } from './components/video-record.component';

@NgModule({
  declarations: [
    VideoRecordComponent,
    VideoFieldComponent
  ],
  imports: [SharedModule],
  exports: [
    VideoRecordComponent,
    VideoFieldComponent,
  ],
})
export class VideoRecordingModule {}
