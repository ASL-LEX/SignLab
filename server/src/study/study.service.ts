import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Study, StudyDocument } from '../study/study.schema';
import { Model } from 'mongoose';
import { Tag } from '../tag/tag.schema';
import { Validator, ValidatorResult } from 'jsonschema';

@Injectable()
export class StudyService {
  constructor(
    @InjectModel(Study.name)
    private studyModel: Model<StudyDocument>
  ) {}

  /**
   * Get a study based on study ID. Will return null if the study with that
   * ID is not found
   */
  async find(studyID: string): Promise<Study | null> {
    return this.studyModel
      .findOne({
        _id: studyID
      })
      .exec();
  }

  async exists(studyName: string, projectID: string) {
    const result = await this.studyModel
      .findOne({
        name: studyName,
        project: projectID
      })
      .exec();

    return result != null;
  }

  /**
   * Get all of the studies regardless of project
   */
  async getAllStudies(): Promise<Study[]> {
    return this.studyModel.find({}).exec();
  }

  /**
   * Get all of the active studies that SignLab is maintaining for a
   * specific project
   */
  async getStudies(projectID: string): Promise<Study[]> {
    return this.studyModel.find({ project: projectID }).exec();
  }

  /**
   * This will validate that the provided tag meets the requirements for
   * the given study.
   */
  validate(tag: Tag): ValidatorResult {
    const validator = new Validator();
    // TODO: Should pull the expected schema directly from the database
    const results = validator.validate(tag.info, tag.study.tagSchema.dataSchema);
    return results;
  }

  async createStudy(study: Study): Promise<Study> {
    return this.studyModel.create(study);
  }
}
