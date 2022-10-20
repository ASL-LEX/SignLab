import { InjectModel } from '@nestjs/mongoose';
import { Dataset } from './dataset.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class DatasetService {
  constructor(@InjectModel(Dataset.name) private datasetModel: Model<Dataset>) {}

  /**
   * Get all datasets
   */
  async findAll(): Promise<Dataset[]> {
    return this.datasetModel.find().exec();
  }

  /**
   * Make a new dataset in the system where the ID is not provided.
   */
  async create(dataset: Pick<Dataset, Exclude<keyof Dataset, '_id'>>): Promise<Dataset> {
    return this.datasetModel.create(dataset);
  }
}
