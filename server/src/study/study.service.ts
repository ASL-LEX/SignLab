import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Study, StudyDocument } from '../study/study.schema';
import { Model } from 'mongoose';
import { Tag } from '../tag/tag.schema';
import { Validator, ValidatorResult } from 'jsonschema';
import { User } from '../user/user.schema';
import { TagService } from '../tag/tag.service';
import { EntryStudyService } from '../entrystudy/entrystudy.service';
import { Project } from '../project/project.schema';

@Injectable()
export class StudyService {
  constructor(
    @InjectModel(Study.name)
    private studyModel: Model<StudyDocument>,
    private readonly tagService: TagService,
    private readonly entryStudyService: EntryStudyService
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

  /**
   * Get Studies that a user can view. Studies that meet the following
   * criteria are visible.
   *
   * 1. If the user is the owner, all studies are visible
   * 2. If the user is an admin for the project, all the studies under the project are visible
   * 3. If the user is an admin for the study, that study is visible
   * 4. If the user is a viewer for the study, that study is visible
   */
  async findByUser(user: User, projectID: string): Promise<Study[]> {
    if (user.roles.owner || user.roles.projectAdmin.get(projectID)) {
      return this.getStudies(projectID);
    }

    const studyAdminIDs = [];
    for (const [id, isAdmin] of user.roles.studyAdmin) {
      if (isAdmin) {
        studyAdminIDs.push(id);
      }
    }

    const studyVisibleIDs = [];
    for (const [id, isVisible] of user.roles.studyVisible) {
      if (isVisible) {
        studyVisibleIDs.push(id);
      }
    }

    // Combine all the IDs
    const allIDs = [...studyAdminIDs, ...studyVisibleIDs];

    // Remove duplicates
    const uniqueIDs = [...new Set(allIDs)];

    return this.studyModel.find({ _id: { $in: uniqueIDs } }).exec();
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

  async deleteForProject(project: Project): Promise<void> {
    const studies = await this.studyModel.find({ project: project._id });
    await Promise.all(studies.map(async (study) => this.delete(study)));
  }

  async delete(study: Study): Promise<void> {
    // Delete all of the tags
    await this.tagService.deleteForStudy(study);

    // Delete the entry studies
    await this.entryStudyService.deleteForStudy(study);

    // Delete the study itself
    await this.studyModel.deleteOne({ _id: study._id });
  }
}
