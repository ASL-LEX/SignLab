import { Component } from '@angular/core';
import { EntryService } from '../../../core/services/entry.service';
import { EntryTableElement } from '../../models/entry-table-element';

/**
 * Provides a view of just the entries with no study context
 */
@Component({
  selector: 'entry-table',
  template: ` <entry-table-core
    [entryData]="entryData"
    [displayDeletion]="true"
    (deleteEntry)="handleDeletion($event)"
  ></entry-table-core>`,
})
export class EntryTable {
  entryData: EntryTableElement[];

  constructor(private entryService: EntryService) {
    this.loadEntries();
  }

  async loadEntries(): Promise<void> {
    const entries = await this.entryService.getEntries();
    console.log(entries);
    this.entryData = entries.map((entry) => {
      return {
        entry: entry,
        isPartOfStudy: true,
        isUsedForTraining: true,
      };
    });
  }

  handleDeletion(entryElem: EntryTableElement) {
    const message =
      'Are you sure you want to delete this entry? Doing so ' +
      'will remove all data related to this entry including ' +
      'existing tags';
    if (!confirm(message)) {
      return;
    }

    this.entryService.delete(entryElem.entry);

    this.entryData = this.entryData.filter((elem) => {
      return elem.entry._id != entryElem.entry._id;
    });
  }
}
