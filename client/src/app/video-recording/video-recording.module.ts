import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {VideoRecordComponent} from "./components/video-record.component";

@NgModule({
  declarations: [
    VideoRecordComponent,
  ],
  imports: [SharedModule],
  exports: [VideoRecordComponent],
})
export class VideoRecordingModule {}
