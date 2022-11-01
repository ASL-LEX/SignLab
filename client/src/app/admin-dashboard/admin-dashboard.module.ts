// Components
import { AdminDashboardComponent } from './components/admin-dashboard.component';

import { DatasetControlComponent } from './components/dataset-control/dataset-control.component';
import { EntryUploadDialog } from './components/dataset-control/entry-upload-dialog/entry-upload-dialog.component';

import { StudiesControlComponent } from './components/studies-control/studies-control.component';
import { StudySelectDialog } from './components/studies-control/study-select-dialog.component';

import { NewStudyComponent } from './components/studies-control/new-study/new-study.component';
import { TagFieldComponent } from './components/studies-control/new-study/tag-field.component';
import { RequiredInfoComponent } from './components/studies-control/new-study/required-info.component';

import { DatasetUploadDialog } from './components/dataset-control/dataset-upload-dialog/dataset-upload-dialog.component';

// Modules
import { NgModule } from '@angular/core';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DatasetTableModule } from '../dataset-table/dataset-table.module';
import { TagFormPreviewDialog } from './components/studies-control/new-study/tag-form-preview.component';
import { UserTableModule } from '../user-table/user-table.module';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DatasetControlComponent,
    EntryUploadDialog,
    StudiesControlComponent,
    StudySelectDialog,
    NewStudyComponent,
    TagFieldComponent,
    RequiredInfoComponent,
    TagFormPreviewDialog,
    DatasetUploadDialog,
  ],
  imports: [
    AdminDashboardRoutingModule,
    SharedModule,
    DatasetTableModule,
    UserTableModule,
  ],
  providers: [],
})
export class AdminDashboardModule {}
