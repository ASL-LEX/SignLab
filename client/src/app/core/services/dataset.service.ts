import { Injectable } from '@angular/core';
import { Dataset } from '../../graphql/graphql';
import { GetDatasetsGQL, GetDatasetsByProjectGQL } from '../../graphql/datasets/datasets.generated';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatasetCreate } from '../../graphql/graphql';
import { CreateDatasetGQL } from '../../graphql/datasets/datasets.generated';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from './project.service';
import { OrganizationService } from './organization.service';

@Injectable()
export class DatasetService {
  /** All datasets that are in SignLab */
  // TODO: Handle if the user doesn't have access to all dataset
  private datasetObs: BehaviorSubject<Dataset[]> = new BehaviorSubject<Dataset[]>([]);
  /** All the datasets which are visible to the active project */
  private visibleDatasetObs: BehaviorSubject<Dataset[]> = new BehaviorSubject<Dataset[]>([]);

  constructor(
    private readonly getDatasetsGQL: GetDatasetsGQL,
    private readonly createDatasetGQL: CreateDatasetGQL,
    private readonly getDatasetsByProjectGQL: GetDatasetsByProjectGQL,
    private readonly projectService: ProjectService,
    private readonly orgService: OrganizationService
  ) {
    // Listen for changes to the organizations
    this.orgService.organization.subscribe((_organization) => {
      this.updateDatasets();
    });

    // Logic for getting datasets visible to the active project
    this.projectService.activeProject.subscribe((_project) => {
      this.updateDatasets();
    });

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

    this.updateDatasets();
  }

  async updateDatasets() {
    const org = await firstValueFrom(this.orgService.organization);
    if (org) {
      const allDatasets = await firstValueFrom(this.getDatasetsGQL.fetch());
      this.datasetObs.next(allDatasets.data ? allDatasets.data.getDatasets : []);
    }

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
