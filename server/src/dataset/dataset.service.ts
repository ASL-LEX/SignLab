import { InjectModel } from '@nestjs/mongoose';
import { Dataset } from './dataset.schema';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class DatasetService {
  constructor(
    @InjectModel(Dataset.name) private datasetModel: Model<Dataset>,
  ) {}

  /**
   * Get all datasets
   */
  async findAll(): Promise<Dataset[]> {
    return this.datasetModel.find().exec();
  }

  /**
   * Find a single dataset based on the query provided
   */
  async findOne(query: FilterQuery<Dataset>): Promise<Dataset | null> {
    return this.datasetModel.findOne(query).exec();
  }

  /**
   * Make a new dataset in the system where the ID is not provided.
   */
  async create(
    dataset: Pick<Dataset, Exclude<keyof Dataset, '_id'>>,
  ): Promise<Dataset> {
    return this.datasetModel.create(dataset);
  }

  /**
   * Check to see if a dataset exists
   */
  async exists(name: string): Promise<boolean> {
    return (await this.datasetModel.findOne({ name }).exec()) !== null;
  }
}
