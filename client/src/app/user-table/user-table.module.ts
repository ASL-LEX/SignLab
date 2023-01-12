import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserSelectDialog } from './components/user-select-dialog.component';
import { UserStudyTable } from './components/user-study-table.component';
import { UserTableCore } from './components/user-table-core.component';

@NgModule({
  declarations: [
    UserTableCore,
    UserStudyTable,
    UserSelectDialog,
  ],
  imports: [SharedModule],
  exports: [UserStudyTable, UserSelectDialog],
})
export class UserTableModule {}
