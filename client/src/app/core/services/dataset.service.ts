import { Injectable } from '@angular/core';
import { SignLabHttpClient } from './http.service';
import { Dataset } from 'shared/dtos/dataset.dto';

@Injectable()
export class DatasetService {
  constructor(private http: SignLabHttpClient) {}

  /**
   * Get all the datasets
   */
  async getDatasets(): Promise<Dataset[]> {
    return this.http.get<Dataset[]>('/api/dataset', { provideToken: true });
  }
}
