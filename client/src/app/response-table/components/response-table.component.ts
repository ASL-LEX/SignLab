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

  constructor(responseService: ResponseService) {
    // Load in responses and convert them to ResponseTableElement(s)
    responseService.getResponses().then((responses) => {
      this.responseData = responses.map((response) => {
        return {
          response: response,
          isPartOfStudy: true,
          isUsedForTraining: true,
        };
      });
    });
  }
}
