// Modules
import { NgModule } from '@angular/core';
import { TaggingInterfaceRoutingModule } from './tagging-interface-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { StudiesModule } from '../studies/studies.module';

// Components
import { TaggingInterface } from './components/tagging-interface.component';
import { TaggingForm } from './components/tagging-form.compont';
import { TaggingLanding } from './components/tagging-landing.component';
import { VideoRecordingModule } from '../video-recording/video-recording.module';

@NgModule({
  declarations: [TaggingInterface, TaggingLanding, TaggingForm],
  imports: [TaggingInterfaceRoutingModule, SharedModule, VideoRecordingModule, CoreModule, StudiesModule],
  providers: [],
})
export class TaggingInterfaceModule {}
