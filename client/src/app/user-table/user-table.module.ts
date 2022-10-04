import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserControlTable } from './components/user-control-table.component';
import { UserSelectDialog } from './components/user-select-dialog.component';
import { UserStudyTable } from './components/user-study-table.component';
import { UserTableCore } from './components/user-table-core.component';

@NgModule({
  declarations: [
    UserTableCore,
    UserControlTable,
    UserStudyTable,
    UserSelectDialog
  ],
  imports: [SharedModule],
  exports: [UserStudyTable, UserControlTable, UserSelectDialog],
})
export class UserTableModule {}
