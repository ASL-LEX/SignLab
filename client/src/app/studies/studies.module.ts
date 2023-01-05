import { NgModule } from '@angular/core';
import { StudiesRoutingModule } from './studies-routing.module';

// Components
import { UserPermissionsComponent } from './components/user-permissions.component';
import { EntryControlsComponent } from './components/entry-controls.component';
import { ContributeComponent } from './components/contribute.component';
import { NewStudyComponent } from './components/new-study.component';

@NgModule({
  declarations: [
    UserPermissionsComponent,
    EntryControlsComponent,
    ContributeComponent,
    NewStudyComponent,
  ],
  imports: [StudiesRoutingModule],
})
export class StudiesModule {}
