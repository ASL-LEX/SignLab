import { Resolver, Query, Mutation, Args, ResolveField, ID, Parent } from '@nestjs/graphql';
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
import { Organization } from '../organization/organization.schema';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { OrganizationContext } from '../organization/organization.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { DatasetPipe } from 'src/shared/pipes/dataset.pipe';

@Resolver(() => Dataset)
export class DatasetResolver {
  constructor(private readonly datasetService: DatasetService, private readonly userPipe: UserPipe) {}

  // TODO: Add owner only guard
  @UseGuards(JwtAuthGuard)
  @Query(() => [Dataset])
  async getDatasets(@OrganizationContext() organization: Organization) {
    return this.datasetService.findAll(organization._id);
  }

  // TODO: Add guard for project access
  @Query(() => [Dataset])
  async getDatasetsByProject(@Args('project', { type: () => ID }, ProjectPipe) project: Project): Promise<Dataset[]> {
    return this.datasetService.getByProject(project._id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Dataset)
  async createDataset(
    @Args('datasetCreate', { type: () => DatasetCreate }, DatasetCreatePipe)
    datasetCreate: DatasetCreateFull,
    @OrganizationContext() organization: Organization
  ): Promise<Dataset> {
    return this.datasetService.create({ ...datasetCreate, organization: organization._id });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean)
  async datasetExists(@Args('name') name: string, @OrganizationContext() organization: Organization): Promise<boolean> {
    return this.datasetService.exists(name, organization._id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async changeProjectAccess(
    @Args('projectAccessChange', { type: () => ProjectAccessChange }, ProjectAccessChangePipe)
    projectAccessChange: ProjectAccessChangeFull
  ): Promise<boolean> {
    await this.datasetService.changeProjectAccess(projectAccessChange);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async changeDatasetName(
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset,
    @Args('newName') newName: string,
    @OrganizationContext() organization: Organization
  ): Promise<boolean> {
    // Ensure the dataset name is unique for the organization
    if (await this.datasetService.exists(newName, organization._id)) {
      throw new BadRequestException(`Dataset with name ${newName} already exists`);
    }

    // Update the name
    await this.datasetService.changeName(dataset, newName);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async changeDatasetDescription(
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset,
    @Args('newDescription') newDescription: string
  ): Promise<boolean> {
    await this.datasetService.changeDescription(dataset, newDescription);
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
