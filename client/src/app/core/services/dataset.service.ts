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

  /**
   * Get if the given dataset exists or not
   */
  async datasetExists(datasetName: string): Promise<boolean> {
    if (!datasetName || datasetName.length === 0) {
      return false;
    }
    return this.http.get<boolean>(`/api/dataset/exists/${datasetName}`, { provideToken: true });
  }

  /**
   * Create a new dataset
   */
  async createDataset(dataset: Pick<Dataset, Exclude<keyof Dataset, '_id'>>): Promise<void> {
    await this.http.post('/api/dataset', dataset, { provideToken: true });
  }
}
