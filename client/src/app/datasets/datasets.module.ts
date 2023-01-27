import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { DatasetTableModule } from '../dataset-table/dataset-table.module';

import { DatasetControlComponent } from './components/dataset-control.component';
import { EntryUploadDialog } from './components/entry-upload-dialog/entry-upload-dialog.component';
import { DatasetUploadDialog } from './components/dataset-upload-dialog/dataset-upload-dialog.component';
import { DatasetsRoutingModule } from './datasets-routing.module';
import { ProjectAccess } from './components/project-access.component';

@NgModule({
  declarations: [
    DatasetControlComponent,
    EntryUploadDialog,
    DatasetUploadDialog,
    ProjectAccess,
  ],
  imports: [
    SharedModule,
    CoreModule,
    DatasetTableModule,
    DatasetsRoutingModule,
  ],
})
export class DatasetsModule {}
