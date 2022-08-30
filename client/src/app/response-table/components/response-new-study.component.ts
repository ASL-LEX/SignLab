import { Component, Output, EventEmitter } from '@angular/core';
import { ResponseService } from '../../core/services/response.service';
import {
  ResponseTableElement,
  ResponseTableToggleChange,
} from '../models/response-table-element';

/**
 * The ResponseNewStudyTable provides the response study table view for the
 * creation of a new study view. This specific view both allows users the
 * ability to choose to enable/disable specific videos for use in a study as
 * well as selecting which responses to be used in the training set of the
 * study.
 *
 * Since this view is used when a study does not yet exist, this table
 * produces a set of responses that need to be marked as disabled and a set
 * of responses that will be used for the training set.
 */
@Component({
  selector: 'response-new-study',
  template: ` <response-table-core
    [displayStudyEnableControls]="true"
    [displayStudyTrainingControls]="true"
    [responseData]="responseData"
    (partOfStudyChange)="markResponseAsEnabled($event)"
    (partOfTrainingChange)="markResponseAsTraining($event)"
  ></response-table-core>`,
})
export class ResponseNewStudyTable {
  /** Set of response IDs that should be marked as disabled for the study */
  markedDisabled = new Set<string>();
  @Output() markedDisabledChange = new EventEmitter<Set<string>>();
  /** Set of response IDs that should be marked as used for training for the study */
  markedTraining = new Set<string>();
  @Output() markedTrainingChange = new EventEmitter<Set<string>>();

  /** The response information to display */
  responseData: ResponseTableElement[];

  constructor(responseService: ResponseService) {
    // Load in responses and convert them to ResponseTableElement(s)
    responseService.getResponses().then((responses) => {
      this.responseData = responses.map((response) => {
        return {
          response: response,
          isUsedForTraining: false,
          isPartOfStudy: true,
        };
      });
    });
  }

  /**
   * Set a response as one that will be enabled for the study.
   *
   * NOTE: Since the general usage has most/all of the responses as enabled,
   * the disabled responses are the ones kept track of. As such a set of
   * disabled responses is maintained.
   */
  markResponseAsEnabled(resTableChange: ResponseTableToggleChange): void {
    this.modifySet(
      this.markedDisabled,
      resTableChange.responseElem,
      !resTableChange.option
    );
    this.markedDisabledChange.emit(this.markedDisabled);
  }

  /**
   * Set a response as one that should be used for training for tagging
   * this study.
   */
  markResponseAsTraining(resTableChange: ResponseTableToggleChange): void {
    this.modifySet(
      this.markedTraining,
      resTableChange.responseElem,
      resTableChange.option
    );
    this.markedTrainingChange.emit(this.markedTraining);
  }

  /**
   * Helper function which ensures that the response ID is present then
   * either adds for removes that ID to a set.
   */
  private modifySet(
    set: Set<string>,
    responseElem: ResponseTableElement,
    shouldBeInSet: boolean
  ): void {
    if (!responseElem.response._id) {
      console.error('Response Table Element lacks ID');
      return;
    }

    if (shouldBeInSet) {
      set.add(responseElem.response._id);
    } else {
      set.delete(responseElem.response._id);
    }
  }
}
