import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserControlTable } from './components/user-control-table.component';
import { UserStudyTable } from './components/user-study-table.component';
import { UserTableCore } from './components/user-table-core.component';

@NgModule({
  declarations: [
    UserTableCore,
    UserControlTable,
    UserStudyTable
  ],
  imports: [SharedModule],
  exports: [UserStudyTable, UserControlTable],
})
export class UserTableModule {}
