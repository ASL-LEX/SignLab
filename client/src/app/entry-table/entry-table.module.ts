import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EntryNewStudyTable } from './components/entry-new-study.component';
import { EntryStudyTable } from './components/entry-study-table.component';
import { EntryTableCoreComponent } from './components/entry-table-core.component';
import { EntryTable } from './components/entry-table.component';
import { EntryPreview } from './components/entry-preview.component';

@NgModule({
  declarations: [
    EntryNewStudyTable,
    EntryStudyTable,
    EntryTableCoreComponent,
    EntryTable,
    EntryPreview,
  ],
  imports: [SharedModule],
  exports: [EntryNewStudyTable, EntryStudyTable, EntryTable],
  providers: [],
})
export class EntryTableModule {}
