import { Injectable } from '@angular/core';
import { Dataset } from '../../graphql/graphql';
import {
  GetDatasetsGQL,
  GetDatasetsByProjectGQL,
  GetDatasetsQuery,
  GetDatasetsQueryVariables
} from '../../graphql/datasets/datasets.generated';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatasetCreate } from '../../graphql/graphql';
import { CreateDatasetGQL } from '../../graphql/datasets/datasets.generated';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from './project.service';
import { OrganizationService } from './organization.service';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';

@Injectable()
export class DatasetService {
  /** All datasets that are in SignLab */
  private datasetObs: BehaviorSubject<Dataset[]> = new BehaviorSubject<Dataset[]>([]);
  /** All the datasets which are visible to the active project */
  private visibleDatasetObs: BehaviorSubject<Dataset[]> = new BehaviorSubject<Dataset[]>([]);
  /** Query for getting all datasets for a given organization */
  private readonly datasetQuery: QueryRef<GetDatasetsQuery, GetDatasetsQueryVariables>;

  constructor(
    getDatasetsGQL: GetDatasetsGQL,
    private readonly createDatasetGQL: CreateDatasetGQL,
    private readonly getDatasetsByProjectGQL: GetDatasetsByProjectGQL,
    private readonly projectService: ProjectService,
    private readonly orgService: OrganizationService
  ) {
    this.datasetQuery = getDatasetsGQL.watch({}, { errorPolicy: 'all' });
    this.datasetQuery.valueChanges.subscribe((result) => this.updateAllDatasets(result));

    // Listen for changes to the organizations
    this.orgService.organization.subscribe(() => this.datasetQuery.refetch());

    // Logic for getting datasets visible to the active project
    this.projectService.activeProject.subscribe(() => this.updateDatasets());

    this.updateDatasets();
  }

  /** Get all of the datasets */
  get datasets(): Observable<Dataset[]> {
    return this.datasetObs.asObservable();
  }

  /** Get the datasets visible to the active project */
  get visibleDatasets(): Observable<Dataset[]> {
    return this.visibleDatasetObs.asObservable();
  }

  async createDataset(dataset: DatasetCreate): Promise<void> {
    await firstValueFrom(this.createDatasetGQL.mutate({ datasetCreate: dataset }));

    // Update list of all datasets
    this.datasetQuery.refetch();
    // Update list of project specific datasets
    this.updateDatasets();
  }

  /** Update all dataset list used by the organiztion */
  async updateAllDatasets(result: ApolloQueryResult<GetDatasetsQuery>) {
    // On errors, have the datasets be an empty list
    if (result.errors) {
      this.datasetObs.next([]);
      return;
    }
    this.datasetObs.next(result.data.getDatasets);
  }

  /** Update the dataset list used by a specific project */
  async updateDatasets() {
    await this.datasetQuery.refetch();
    // Update the visible datasets for the project
    const currentProject = await firstValueFrom(this.projectService.activeProject);
    if (currentProject) {
      const projectDatasets = await firstValueFrom(this.getDatasetsByProjectGQL.fetch({ project: currentProject._id }));
      if (projectDatasets.data) {
        this.visibleDatasetObs.next(projectDatasets.data.getDatasetsByProject);
      }
    } else {
      this.visibleDatasetObs.next([]);
    }
  }
}
