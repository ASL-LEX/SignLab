import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserStudyTable } from './components/user-study-table.component';
import { UserTableCore } from './components/user-table-core.component';

@NgModule({
  declarations: [
    UserTableCore,
    UserStudyTable
  ],
  imports: [SharedModule],
  exports: [UserStudyTable],
})
export class UserTableModule {}
