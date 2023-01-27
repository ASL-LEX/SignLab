import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { EntryService } from '../../../core/services/entry.service';
import { EntryTableElement, EntryTableToggleChange } from '../../models/entry-table-element';
import { Dataset } from '../../../graphql/graphql';

/**
 * The EntryNewStudyTable provides the entry study table view for the
 * creation of a new study view. This specific view both allows users the
 * ability to choose to enable/disable specific videos for use in a study as
 * well as selecting which entries to be used in the training set of the
 * study.
 *
 * Since this view is used when a study does not yet exist, this table
 * produces a set of entries that need to be marked as disabled and a set
 * of entries that will be used for the training set.
 */
@Component({
  selector: 'entry-new-study',
  template: ` <entry-table-core
    [displayStudyEnableControls]="true"
    [displayStudyTrainingControls]="true"
    [entryData]="entryData"
    (partOfStudyChange)="markEntryAsEnabled($event)"
    (partOfTrainingChange)="markEntryAsTraining($event)"
  ></entry-table-core>`
})
export class EntryNewStudyTable implements OnInit {
  /** Set of entry IDs that should be marked as disabled for the study */
  markedDisabled = new Set<string>();
  @Output() markedDisabledChange = new EventEmitter<Set<string>>();
  /** Set of entry IDs that should be marked as used for training for the study */
  markedTraining = new Set<string>();
  @Output() markedTrainingChange = new EventEmitter<Set<string>>();
  /** The dataset to display for */
  @Input() dataset: Dataset;

  /** The entry information to display */
  entryData: EntryTableElement[];

  constructor(private entryService: EntryService) {}

  ngOnInit(): void {
    // Load in entries and convert them to EntryTableElement(s)
    this.entryService.getEntriesForDataset(this.dataset).then((entries) => {
      this.entryData = entries.map((entry) => {
        return {
          entry: entry,
          isUsedForTraining: false,
          isPartOfStudy: true
        };
      });
    });
  }

  /**
   * Set a entry as one that will be enabled for the study.
   *
   * NOTE: Since the general usage has most/all of the entries as enabled,
   * the disabled entries are the ones kept track of. As such a set of
   * disabled entries is maintained.
   */
  markEntryAsEnabled(resTableChange: EntryTableToggleChange): void {
    this.modifySet(this.markedDisabled, resTableChange.entryElem, !resTableChange.option);
    this.markedDisabledChange.emit(this.markedDisabled);
  }

  /**
   * Set a entry as one that should be used for training for tagging
   * this study.
   */
  markEntryAsTraining(resTableChange: EntryTableToggleChange): void {
    this.modifySet(this.markedTraining, resTableChange.entryElem, resTableChange.option);
    this.markedTrainingChange.emit(this.markedTraining);
  }

  /**
   * Helper function which ensures that the entry ID is present then
   * either adds for removes that ID to a set.
   */
  private modifySet(set: Set<string>, entryElem: EntryTableElement, shouldBeInSet: boolean): void {
    if (!entryElem.entry._id) {
      console.error('Entry Table Element lacks ID');
      return;
    }

    if (shouldBeInSet) {
      set.add(entryElem.entry._id);
    } else {
      set.delete(entryElem.entry._id);
    }
  }
}
