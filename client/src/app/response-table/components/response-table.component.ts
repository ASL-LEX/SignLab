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
}
