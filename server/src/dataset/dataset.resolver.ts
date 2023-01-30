import { Resolver, Query, Mutation, Args, ResolveField, ID } from '@nestjs/graphql';
import { DatasetService } from './dataset.service';
import { Dataset } from './dataset.schema';
import {
  DatasetCreate,
  DatasetCreateFull,
  DatasetCreatePipe,
  ProjectAccessChange,
  ProjectAccessChangeFull,
  ProjectAccessChangePipe
} from './dataset.dto';
import { User } from '../user/user.schema';
import mongoose from 'mongoose';
import { UserPipe } from '../shared/pipes/user.pipe';
import { ProjectPipe } from '../shared/pipes/project.pipe';
import { Project } from '../project/project.schema';

@Resolver(() => Dataset)
export class DatasetResolver {
  constructor(private readonly datasetService: DatasetService, private readonly userPipe: UserPipe) {}

  // TODO: Add owner only guard
  @Query(() => [Dataset])
  async getDatasets() {
    return this.datasetService.findAll();
  }

  // TODO: Add guard for project access
  @Query(() => [Dataset])
  async getDatasetsByProject(@Args('project', { type: () => ID }, ProjectPipe) project: Project): Promise<Dataset[]> {
    return this.datasetService.getByProject(project);
  }

  @Mutation(() => Dataset)
  async createDataset(
    @Args('datasetCreate', { type: () => DatasetCreate }, DatasetCreatePipe)
    datasetCreate: DatasetCreateFull
  ): Promise<Dataset> {
    return this.datasetService.create(datasetCreate);
  }

  @Query(() => Boolean)
  async datasetExists(@Args('name') name: string): Promise<boolean> {
    return this.datasetService.exists(name);
  }

  @Mutation(() => Boolean)
  async changeProjectAccess(
    @Args('projectAccessChange', { type: () => ProjectAccessChange }, ProjectAccessChangePipe)
    projectAccessChange: ProjectAccessChangeFull
  ): Promise<boolean> {
    await this.datasetService.changeProjectAccess(projectAccessChange);
    return true;
  }

  @ResolveField()
  async creator(dataset: Dataset): Promise<User> {
    if (dataset.creator instanceof mongoose.Types.ObjectId) {
      return this.userPipe.transform(dataset.creator.toString());
    }
    return dataset.creator;
  }
}
