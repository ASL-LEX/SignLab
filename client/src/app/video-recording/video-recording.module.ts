import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VideoFieldComponent } from './components/video-field.component';
import { VideoRecordComponent } from './components/video-record.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    VideoRecordComponent,
    VideoFieldComponent
  ],
  imports: [
    SharedModule,
    CoreModule
  ],
  exports: [
    VideoRecordComponent,
    VideoFieldComponent,
  ],
  providers: []
})
export class VideoRecordingModule {}
