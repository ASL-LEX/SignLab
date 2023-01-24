import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
import { DatasetService } from './dataset.service';
import { Dataset } from './dataset.schema';
import {DatasetCreate, DatasetCreateFull, DatasetCreatePipe} from './dataset.dto';
import { User } from '../user/user.schema';
import mongoose from 'mongoose';
import { UserPipe } from '../shared/pipes/user.pipe';

@Resolver(() => Dataset)
export class DatasetResolver {
  constructor(private readonly datasetService: DatasetService, private readonly userPipe: UserPipe) {}

  @Query(() => [Dataset])
  async getDatasets() {
    return this.datasetService.findAll();
  }

  @Mutation(() => Dataset)
  async createDataset(@Args('datasetCreate', { type: () => DatasetCreate }, DatasetCreatePipe) datasetCreate: DatasetCreateFull): Promise<Dataset> {
    return this.datasetService.create(datasetCreate);
  }

  @Query(() => Boolean)
  async datasetExists(@Args('name') name: string): Promise<boolean> {
    return this.datasetService.exists(name);
  }

  @ResolveField()
  async creator(dataset: Dataset): Promise<User> {
    if (dataset.creator instanceof mongoose.Types.ObjectId) {
      return this.userPipe.transform(dataset.creator.toString());
    }
    return dataset.creator;
  }
}
