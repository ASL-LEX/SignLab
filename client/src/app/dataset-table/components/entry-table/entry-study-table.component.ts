import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  EntryTableElement,
  EntryTableToggleChange,
} from '../../models/entry-table-element';
import { EntryService } from '../../../core/services/entry.service';
import { Study } from 'shared/dtos/study.dto';
import { Dataset } from 'shared/dtos/dataset.dto';

/**
 * The EntryStudyTable provides the view for editing entry information
 * for an existing study. This allows users to see (but not edit) which
 * entries are in the training set. This also allows users to ability
 * to enable/disable entries in the study.
 *
 * Since the study exists in the database, changing the enable status will
 * hit the backend directly.
 */
@Component({
  selector: 'entry-study-table',
  template: ` <entry-table-core
    [displayStudyEnableControls]="true"
    [displayStudyTrainingControls]="false"
    [entryData]="entryData"
    (partOfStudyChange)="updatePartOfStudy($event)"
  ></entry-table-core>`,
})
export class EntryStudyTable implements OnInit, OnChanges {
  /** The ID of the study that is being viewed */
  @Input() study: Study | null;
  /** The entry information including the study specific information */
  entryData: EntryTableElement[];
  /** The dataset that is being viewed */
  @Input() dataset: Dataset | null;

  constructor(private entryService: EntryService) {
    this.updatePartOfStudy = this.updatePartOfStudy.bind(this);
  }

  ngOnInit(): void {
    this.loadEntries();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.study) {
      this.study = changes.study.currentValue;
      this.loadEntries();
    }
  }

  async loadEntries() {
    if (this.study && this.dataset) {
      this.entryData = await this.entryService.getEntryStudies(this.study, this.dataset);
    }
  }

  /**
   * Control if the given entry should be part of the study or not. This
   * will make the change against the backend
   */
  async updatePartOfStudy(
    resTableChange: EntryTableToggleChange
  ): Promise<void> {
    if (resTableChange.entryElem.entry._id === undefined) {
      console.error(
        'No ID associated with entry, cannot update partOfStudy state'
      );
      return;
    }
    if (this.study === null) {
      console.error('Cannot change state of entry without study ID');
      return;
    }

    const result = await this.entryService.setUsedInStudy(
      resTableChange.entryElem.entry._id,
      resTableChange.option,
      this.study._id!
    );

    if (!result) {
      resTableChange.entryElem.isPartOfStudy = !resTableChange.option;
      alert('Failed to update "Part of Study" property');
    }
  }
}
