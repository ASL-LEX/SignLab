import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EntryNewStudyTable } from './components/entry-table/entry-new-study.component';
import { EntryStudyTable } from './components/entry-table/entry-study-table.component';
import { EntryTableCoreComponent } from './components/entry-table/entry-table-core.component';
import { EntryTable } from './components/entry-table/entry-table.component';
import { EntryPreview } from './components/entry-table/entry-preview.component';
import { DatasetTable } from './components/dataset-table.component';

@NgModule({
  declarations: [
    EntryNewStudyTable,
    EntryStudyTable,
    EntryTableCoreComponent,
    EntryTable,
    EntryPreview,
    DatasetTable
  ],
  imports: [SharedModule],
  exports: [EntryNewStudyTable, EntryStudyTable, EntryTable, DatasetTable],
  providers: [],
})
export class DatasetTableModule {}
