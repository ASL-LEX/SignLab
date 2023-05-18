import { InjectModel } from '@nestjs/mongoose';
import { Dataset } from './dataset.schema';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { ProjectAccessChangeFull } from './dataset.dto';
import { EntryStudyService } from '../entrystudy/entrystudy.service';
import { StudyService } from '../study/study.service';
import { EntryStudy } from '../entrystudy/entrystudy.schema';

@Injectable()
export class DatasetService {
  constructor(@InjectModel(Dataset.name) private datasetModel: Model<Dataset>,
             private readonly entryStudyService: EntryStudyService,
             private readonly studyService: StudyService) {}

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

  async getByProject(project: string): Promise<Dataset[]> {
    return this.datasetModel.find({ [`projectAccess.${project}`]: true }).exec();
  }

  async changeName(dataset: Dataset, newName: string): Promise<void> {
    await this.datasetModel.updateOne({ _id: dataset._id }, { $set: { name: newName } });
  }

  async changeDescription(dataset: Dataset, newDescription: string): Promise<void> {
    await this.datasetModel.updateOne({ _id: dataset._id }, { $set: { description: newDescription } });
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

    // Determine the studies impacted by the change
    const studies = await this.studyService.getStudies(projectAccessChange.project._id);

    // Get all impacted entry studies
    const entryStudies: EntryStudy[] = (await Promise.all(studies.map(async (study) => {
      return this.entryStudyService.getEntryStudies(study, projectAccessChange.dataset)
    }))).flat();


    // Update if the entry studies should still be in the study
    await Promise.all(entryStudies.map(async (entryStudy) => {
      await this.entryStudyService.markSingleDisabled(entryStudy.study._id!, entryStudy.entry._id!, !projectAccessChange.hasAccess);
    }));
  }
}
