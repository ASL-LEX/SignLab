// Components
import { AdminDashboardComponent } from './components/admin-dashboard.component';

import { EntryControlComponent } from './components/entry-control/entry-control.component';
import { EntryUploadDialog } from './components/entry-control/entry-upload-dialog/entry-upload-dialog.component';

import { StudiesControlComponent } from './components/studies-control/studies-control.component';
import { StudySelectDialog } from './components/studies-control/study-select-dialog.component';

import { NewStudyComponent } from './components/studies-control/new-study/new-study.component';
import { TagFieldComponent } from './components/studies-control/new-study/tag-field.component';
import { RequiredInfoComponent } from './components/studies-control/new-study/required-info.component';

// Modules
import { NgModule } from '@angular/core';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EntryTableModule } from '../entry-table/entry-table.module';
import { TagFormPreviewDialog } from './components/studies-control/new-study/tag-form-preview.component';
import { UserTableModule } from '../user-table/user-table.module';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    EntryControlComponent,
    EntryUploadDialog,
    StudiesControlComponent,
    StudySelectDialog,
    NewStudyComponent,
    TagFieldComponent,
    RequiredInfoComponent,
    TagFormPreviewDialog,
  ],
  imports: [
    AdminDashboardRoutingModule,
    SharedModule,
    EntryTableModule,
    UserTableModule,
  ],
  providers: [],
})
export class AdminDashboardModule {}
