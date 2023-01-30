import { NgModule } from '@angular/core';
import { StudiesRoutingModule } from './studies-routing.module';
import { DatasetTableModule } from '../dataset-table/dataset-table.module';
import { CoreModule } from '../core/core.module';

// Components
import { UserPermissionsComponent } from './components/user-permissions.component';
import { EntryControlsComponent } from './components/entry-controls.component';
import { NewStudyComponent } from './components/new-study/new-study.component';
import { SharedModule } from '../shared/shared.module';
import { RequiredInfoComponent } from './components/new-study/required-info.component';
import { TagFormPreviewDialog } from './components/new-study/tag-form-preview.component';
import { TagFieldComponent } from './components/new-study/tag-field.component';
import { TagFieldGeneratorService } from './services/tag-field-generator.service';
import { TagViewComponent } from './components/tag-view.component';

@NgModule({
  declarations: [
    UserPermissionsComponent,
    EntryControlsComponent,
    NewStudyComponent,
    RequiredInfoComponent,
    TagFormPreviewDialog,
    TagFieldComponent,
    TagViewComponent
  ],
  imports: [StudiesRoutingModule, DatasetTableModule, CoreModule, SharedModule],
  providers: [TagFieldGeneratorService]
})
export class StudiesModule {}
