import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ResponseNewStudyTable } from './components/response-new-study.component';
import { ResponseStudyTable } from './components/response-study-table.component';
import { ResponseTableCoreComponent } from './components/response-table-core.component';
import { ResponseTable } from './components/response-table.component';
import { ResponsePreview } from './components/response-preview.component';

@NgModule({
  declarations: [
    ResponseNewStudyTable,
    ResponseStudyTable,
    ResponseTableCoreComponent,
    ResponseTable,
    ResponsePreview,
  ],
  imports: [SharedModule],
  exports: [ResponseNewStudyTable, ResponseStudyTable, ResponseTable],
  providers: [],
})
export class ResponseTableModule {}
