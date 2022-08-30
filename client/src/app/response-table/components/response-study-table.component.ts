import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ResponseTableElement,
  ResponseTableToggleChange,
} from '../models/response-table-element';
import { ResponseService } from '../../core/services/response.service';
import { Study } from 'shared/dtos/study.dto';

/**
 * The ResponseStudyTable provides the view for editing response information
 * for an existing study. This allows users to see (but not edit) which
 * responses are in the training set. This also allows users to ability
 * to enable/disable responses in the study.
 *
 * Since the study exists in the database, changing the enable status will
 * hit the backend directly.
 */
@Component({
  selector: 'response-study-table',
  template: ` <response-table-core
    [displayStudyEnableControls]="true"
    [displayStudyTrainingControls]="false"
    [responseData]="responseData"
    (partOfStudyChange)="updatePartOfStudy($event)"
  ></response-table-core>`,
})
export class ResponseStudyTable implements OnInit, OnChanges {
  /** The ID of the study that is being viewed */
  @Input() study: Study | null;
  /** The response information including the study specific information */
  responseData: ResponseTableElement[];

  constructor(private responseService: ResponseService) {
    this.updatePartOfStudy = this.updatePartOfStudy.bind(this);
  }

  ngOnInit(): void {
    this.loadResponses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.study) {
      this.study = changes.study.currentValue;
      this.loadResponses();
    }
  }

  async loadResponses() {
    if (this.study) {
      this.responseData = await this.responseService.getResponseStudies(
        this.study._id!
      );
    }
  }

  /**
   * Control if the given response should be part of the study or not. This
   * will make the change against the backend
   */
  async updatePartOfStudy(
    resTableChange: ResponseTableToggleChange
  ): Promise<void> {
    if (resTableChange.responseElem.response._id === undefined) {
      console.error(
        'No ID associated with response, cannot update partOfStudy state'
      );
      return;
    }
    if (this.study === null) {
      console.error('Cannot change state of response without study ID');
      return;
    }

    const result = await this.responseService.setUsedInStudy(
      resTableChange.responseElem.response._id,
      resTableChange.option,
      this.study._id!
    );

    if (!result) {
      resTableChange.responseElem.isPartOfStudy = !resTableChange.option;
      alert('Failed to update "Part of Study" property');
    }
  }
}
