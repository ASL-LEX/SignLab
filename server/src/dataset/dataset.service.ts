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
}
