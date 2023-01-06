import { NgModule } from '@angular/core';
import { StudiesRoutingModule } from './studies-routing.module';
import { DatasetTableModule } from '../dataset-table/dataset-table.module';
import { CoreModule } from '../core/core.module';

// Components
import { UserPermissionsComponent } from './components/user-permissions.component';
import { EntryControlsComponent } from './components/entry-controls.component';
import { UserTableModule } from '../user-table/user-table.module';
import { NewStudyComponent } from './components/new-study/new-study.component';
import { SharedModule } from '../shared/shared.module';
import { RequiredInfoComponent } from './components/new-study/required-info.component';
import { TagFormPreviewDialog } from './components/new-study/tag-form-preview.component';
import { TagFieldComponent } from './components/new-study/tag-field.component';
import { TagFieldGeneratorService } from './services/tag-field-generator.service';


@NgModule({
  declarations: [
    UserPermissionsComponent,
    EntryControlsComponent,
    NewStudyComponent,
    RequiredInfoComponent,
    TagFormPreviewDialog,
    TagFieldComponent
  ],
  imports: [StudiesRoutingModule, DatasetTableModule, CoreModule, UserTableModule, SharedModule],
  providers: [TagFieldGeneratorService],
})
export class StudiesModule {}
