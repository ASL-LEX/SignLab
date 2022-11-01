import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EntryNewStudyTable } from './components/entry-table/entry-new-study.component';
import { EntryStudyTable } from './components/entry-table/entry-study-table.component';
import { EntryTableCoreComponent } from './components/entry-table/entry-table-core.component';
import { EntryTable } from './components/entry-table/entry-table.component';
import { EntryPreview } from './components/entry-table/entry-preview.component';
import { DatasetTable } from './components/dataset-table.component';
import { DatasetStudyTable } from './components/dataset-study-table.component';
import { DatasetNewStudy } from './components/dataset-new-study.component';

@NgModule({
  declarations: [
    EntryNewStudyTable,
    EntryStudyTable,
    EntryTableCoreComponent,
    EntryTable,
    EntryPreview,
    DatasetTable,
    DatasetStudyTable,
    DatasetNewStudy,
  ],
  imports: [SharedModule],
  exports: [
    EntryNewStudyTable,
    EntryStudyTable,
    EntryTable,
    DatasetTable,
    DatasetStudyTable,
    DatasetNewStudy,
  ],
  providers: [],
})
export class DatasetTableModule {}
