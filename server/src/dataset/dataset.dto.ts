import { Field, ID, InputType, OmitType } from '@nestjs/graphql';
import { Dataset } from './dataset.schema';
import { UserPipe } from '../shared/pipes/user.pipe';
import { Injectable, PipeTransform } from '@nestjs/common';
import { Project } from '../project/project.schema';
import { ProjectPipe } from '../shared/pipes/project.pipe';
import { DatasetPipe } from '../shared/pipes/dataset.pipe';

/** DTO that the user provides when creating a new dataset */
@InputType()
export class DatasetCreate extends OmitType(Dataset, ['_id', 'creator', 'projectAccess'] as const, InputType) {
  @Field(() => ID, {
    description: 'The ID of the user who is creating the dataset'
  })
  creatorID: string;
}

/** Represents the dataset create object with the populated user field */
export type DatasetCreateFull = Omit<Dataset, '_id'>;

/** Pipe to convert the DatasetCreate to DatasetCreateFull */
@Injectable()
export class DatasetCreatePipe implements PipeTransform<DatasetCreate, Promise<DatasetCreateFull>> {
  constructor(private readonly userPipe: UserPipe) {}

  async transform(value: DatasetCreate): Promise<DatasetCreateFull> {
    const creator = await this.userPipe.transform(value.creatorID);
    return { ...value, creator, projectAccess: {} };
  }
}

/** DTO to request change of project access */
@InputType()
export class ProjectAccessChange {
  @Field(() => ID, {
    description: 'The ID of the dataset to change project access to'
  })
  datasetID: string;

  @Field(() => ID, { description: 'The ID of the project to change access to' })
  projectID: string;

  @Field(() => Boolean, {
    description: 'If the project should have access to the dataset'
  })
  hasAccess: boolean;
}

/** Represent the ProjectAccessChange request with fully populated field */
export interface ProjectAccessChangeFull {
  dataset: Dataset;
  project: Project;
  hasAccess: boolean;
}

@Injectable()
export class ProjectAccessChangePipe implements PipeTransform<ProjectAccessChange, Promise<ProjectAccessChangeFull>> {
  constructor(private readonly datasetPipe: DatasetPipe, private readonly projectPipe: ProjectPipe) {}

  async transform(value: ProjectAccessChange): Promise<ProjectAccessChangeFull> {
    const dataset = await this.datasetPipe.transform(value.datasetID);
    const project = await this.projectPipe.transform(value.projectID);
    return { dataset, project, hasAccess: value.hasAccess };
  }
}
