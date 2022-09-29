import { Component } from '@angular/core';
import { ResponseService } from '../../core/services/response.service';
import { ResponseTableElement } from '../models/response-table-element';

/**
 * Provides a view of just the responses with no study context
 */
@Component({
  selector: 'response-table',
  template: ` <response-table-core
    [responseData]="responseData"
    [displayDeletion]="true"
    (deleteResponse)="handleDeletion($event)"
  ></response-table-core>`,
})
export class ResponseTable {
  responseData: ResponseTableElement[];

  constructor(private responseService: ResponseService) {
    this.loadResponses();
  }

  async loadResponses(): Promise<void> {
    const responses = await this.responseService.getResponses();
    this.responseData = responses.map((response) => {
      return {
        response: response,
        isPartOfStudy: true,
        isUsedForTraining: true,
      };
    });
  }

  handleDeletion(responseElem: ResponseTableElement) {
    const message =
      'Are you sure you want to delete this response? Doing so ' +
      'will remove all data related to this response including ' +
      'existing tags';
    if (!confirm(message)) {
      return;
    }

    this.responseService.delete(responseElem.response);

    this.responseData = this.responseData.filter((elem) => {
      return elem.response._id != responseElem.response._id;
    });
  }
}
