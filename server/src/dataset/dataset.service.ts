import { InjectModel } from '@nestjs/mongoose';
import { Dataset } from './dataset.schema';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { ProjectAccessChangeFull } from './dataset.dto';
import { Project } from '../project/project.schema';

@Injectable()
export class DatasetService {
  constructor(@InjectModel(Dataset.name) private datasetModel: Model<Dataset>) {}

  /**
   * Get all datasets
   */
  async findAll(organization: string): Promise<Dataset[]> {
    return this.datasetModel.find({ organization }).exec();
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
  async create(dataset: Pick<Dataset, Exclude<keyof Dataset, '_id'>>): Promise<Dataset> {
    return this.datasetModel.create(dataset);
  }

  /**
   * Check to see if a dataset exists
   */
  async exists(name: string, organization: string): Promise<boolean> {
    return (await this.datasetModel.findOne({ name, organization }).exec()) !== null;
  }

  async getByProject(project: Project): Promise<Dataset[]> {
    return this.datasetModel.find({ [`projectAccess.${project._id}`]: true }).exec();
  }

  async changeName(dataset: Dataset, newName: string): Promise<void> {
    await this.datasetModel.updateOne({ _id: dataset._id }, { $set: { name: newName } });
  }

  async changeProjectAccess(projectAccessChange: ProjectAccessChangeFull): Promise<void> {
    await this.datasetModel
      .updateOne(
        { _id: projectAccessChange.dataset._id },
        {
          $set: {
            [`projectAccess.${projectAccessChange.project._id}`]: projectAccessChange.hasAccess
          }
        }
      )
      .exec();
  }
}
