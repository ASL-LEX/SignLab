import { Component, Input, OnInit } from '@angular/core';
import { EntryService } from '../../../core/services/entry.service';
import { EntryTableElement } from '../../models/entry-table-element';
import { Dataset } from '../../../graphql/graphql';

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
export class EntryTable implements OnInit {
  /** The dataset this entry table is displaying for */
  @Input() dataset: Dataset;

  entryData: EntryTableElement[];

  constructor(private entryService: EntryService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  async loadEntries(): Promise<void> {
    // TODO: Log error
    if (this.dataset === undefined) {
      return;
    }

    const entries = await this.entryService.getEntriesForDataset(this.dataset);
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
