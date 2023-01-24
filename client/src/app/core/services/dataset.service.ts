import { Injectable } from '@angular/core';
import { SignLabHttpClient } from './http.service';
import { Dataset } from '../../graphql/graphql';
import { GetDatasetsGQL, GetDatasetsQuery, GetDatasetsQueryVariables } from '../../graphql/datasets/datasets.generated';
import { BehaviorSubject, Observable } from 'rxjs';
import { QueryRef } from 'apollo-angular';
import { DatasetCreate } from '../../graphql/graphql';
import { CreateDatasetGQL } from '../../graphql/datasets/datasets.generated';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DatasetService {
  private datasetObs: BehaviorSubject<Dataset[]> = new BehaviorSubject<Dataset[]>([]);
  private readonly datasetQuery: QueryRef<GetDatasetsQuery, GetDatasetsQueryVariables>;

  constructor(private http: SignLabHttpClient,
              private readonly getDatasetsGQL: GetDatasetsGQL,
              private readonly createDatasetGQL: CreateDatasetGQL) {
    this.datasetQuery = this.getDatasetsGQL.watch();
    this.datasetQuery.valueChanges.subscribe((result) => {
      this.datasetObs.next(result.data.getDatasets);
    });
  }

  /**
   * Get all the datasets
   */
  get datasets(): Observable<Dataset[]> {
    return this.datasetObs.asObservable();
  }

  /**
   * Get if the given dataset exists or not
   */
  async datasetExists(datasetName: string): Promise<boolean> {
    if (!datasetName || datasetName.length === 0) {
      return false;
    }
    return this.http.get<boolean>(`/api/dataset/exists/${datasetName}`, {
      provideToken: true,
    });
  }

  /**
   * Create a new dataset
   */
  async createDataset(
    dataset: DatasetCreate
  ): Promise<void> {
    await firstValueFrom(this.createDatasetGQL.mutate({ datasetCreate: dataset }));

    this.datasetQuery.refetch();
  }
}
