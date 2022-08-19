// Modules
import { NgModule } from '@angular/core';
import { TaggingInterfaceRoutingModule } from './tagging-interface-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { TaggingInterface } from './components/tagging-interface.component';
import { TaggingForm } from './components/tagging-form.compont';

@NgModule({
  declarations: [
    TaggingInterface,
    TaggingForm
  ],
  imports: [
    TaggingInterfaceRoutingModule,
    SharedModule
  ],
  providers: [],
})
export class TaggingInterfaceModule { }
