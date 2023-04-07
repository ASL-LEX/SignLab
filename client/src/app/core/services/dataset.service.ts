import { Injectable } from '@angular/core';
import { SignLabHttpClient } from './http.service';
import { Dataset } from '../../graphql/graphql';
import {
  GetDatasetsGQL,
  GetDatasetsQuery,
  GetDatasetsQueryVariables,
  GetDatasetsByProjectGQL
} from '../../graphql/datasets/datasets.generated';
import { BehaviorSubject, Observable } from 'rxjs';
import { QueryRef } from 'apollo-angular';
import { DatasetCreate } from '../../graphql/graphql';
import { CreateDatasetGQL } from '../../graphql/datasets/datasets.generated';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from './project.service';

@Injectable()
export class DatasetService {
  /** All datasets that are in SignLab */
  // TODO: Handle if the user doesn't have access to all dataset
  private datasetObs: BehaviorSubject<Dataset[]> = new BehaviorSubject<Dataset[]>([]);
  /** Query which was used to get the datasets, used to refetch */
  private readonly datasetQuery: QueryRef<GetDatasetsQuery, GetDatasetsQueryVariables>;
  /** All the datasets which are visible to the active project */
  private visibleDatasetObs: BehaviorSubject<Dataset[]> = new BehaviorSubject<Dataset[]>([]);

  constructor(
    private http: SignLabHttpClient,
    private readonly getDatasetsGQL: GetDatasetsGQL,
    private readonly createDatasetGQL: CreateDatasetGQL,
    private readonly getDatasetsByProjectGQL: GetDatasetsByProjectGQL,
    private readonly projectService: ProjectService
  ) {
    // Logic for getting all datasets
    this.datasetQuery = this.getDatasetsGQL.watch();
    this.datasetQuery.valueChanges.subscribe((result) => {
      this.datasetObs.next(result.data.getDatasets);
    });

    // Logic for getting datasets visible to the active project
    this.projectService.activeProject.subscribe((project) => {
      if (!project) {
        this.visibleDatasetObs.next([]);
        return;
      }

      this.getDatasetsByProjectGQL.fetch({ project: project._id }).subscribe((result) => {
        this.visibleDatasetObs.next(result.data.getDatasetsByProject);
      });
    });
  }

  /** Get all of the datasets */
  get datasets(): Observable<Dataset[]> {
    return this.datasetObs.asObservable();
  }

  /** Get the datasets visible to the active project */
  get visibleDatasets(): Observable<Dataset[]> {
    return this.visibleDatasetObs.asObservable();
  }

  /** Get if the given dataset exists or not */
  async datasetExists(datasetName: string): Promise<boolean> {
    if (!datasetName || datasetName.length === 0) {
      return false;
    }
    return this.http.get<boolean>(`/api/dataset/exists/${datasetName}`, {
      provideToken: true
    });
  }

  async createDataset(dataset: DatasetCreate): Promise<void> {
    await firstValueFrom(this.createDatasetGQL.mutate({ datasetCreate: dataset }));

    this.datasetQuery.refetch();
  }

  async updateDatasets() {
    await this.datasetQuery.refetch();
  }
}
