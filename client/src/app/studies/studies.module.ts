import { NgModule } from '@angular/core';
import { StudiesRoutingModule } from './studies-routing.module';
import { DatasetTableModule } from '../dataset-table/dataset-table.module';
import { CoreModule } from '../core/core.module';

// Components
import { UserPermissionsComponent } from './components/user-permissions.component';
import { EntryControlsComponent } from './components/entry-controls.component';
import { ContributeComponent } from './components/contribute.component';
import { NewStudyComponent } from './components/new-study.component';
import { StudySelectComponent } from './components/study-select.component';
import { UserTableModule } from '../user-table/user-table.module';

@NgModule({
  declarations: [
    UserPermissionsComponent,
    EntryControlsComponent,
    ContributeComponent,
    NewStudyComponent,
    StudySelectComponent,
  ],
  imports: [StudiesRoutingModule, DatasetTableModule, CoreModule, UserTableModule],
})
export class StudiesModule {}
