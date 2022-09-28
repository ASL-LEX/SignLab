import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Study } from '../schemas/study.schema';
import { User } from '../schemas/user.schema';
import { Tag, TagDocument } from '../schemas/tag.schema';
import { Response } from '../schemas/response.schema';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  /**
   * Make a new tag for the given user, study, and response. When the tag is
   * created, it is considered incomplete
   *
   * @param user The user who will complete the tag
   * @param response The response that the tag is associated with
   * @param study The study the tag is for
   * @return A new tag
   */
  async createTag(user: User, response: Response, study: Study): Promise<Tag> {
    return this.tagModel.create({
      response: response,
      study: study,
      user: user,
      complete: false,
      isTraining: false,
    });
  }

  /**
   * Make a new training tag. When this tag is created it is considered
   * incomplete.
   */
  async createTrainingTag(
    user: User,
    response: Response,
    study: Study,
  ): Promise<Tag> {
    const result = await (
      await this.tagModel.create({
        response: response,
        study: study,
        user: user,
        complete: false,
        isTraining: true,
      })
    ).populate('response');

    return result;
  }

  /**
   * Get all the tags for the given study that are complete.
   *
   * @param study The study to search for
   */
  async getCompleteTags(study: Study): Promise<Tag[]> {
    return this.tagModel
      .find({
        study: study._id!,
        complete: true,
        isTraining: false,
      })
      .populate('user')
      .populate('study')
      .populate('response')
      .exec();
  }

  /**
   * Get all complete training tags for a given user and study
   */
  async getCompleteTrainingTags(user: User, study: Study): Promise<Tag[]> {
    return this.tagModel
      .find({
        study: study._id!,
        complete: true,
        isTraining: true,
        user: user._id,
      })
      .populate('user')
      .populate('study')
      .populate('response')
      .exec();
  }

  /**
   * Find a response and tag that the given user has yet to complete for
   * the given study. If the user does not have an incomplete tag, then null
   * is returned.
   *
   * @param user The user to search for
   * @param study The study that tag is associated with
   */
  async getIncompleteTag(user: User, study: Study): Promise<Tag | null> {
    return this.getIncompleteTagGeneric(user, study, false);
  }

  /**
   * Find a response and tag for the given user that was incomplete as part
   * of the training for a specific study.
   */
  async getIncompleteTrainingTag(
    user: User,
    study: Study,
  ): Promise<Tag | null> {
    return this.getIncompleteTagGeneric(user, study, true);
  }

  /**
   * Find a response and tag that the user has yet to complete either
   * from the normal data set or the training data set.
   */
  private async getIncompleteTagGeneric(
    user: User,
    study: Study,
    fromTrainingSet: boolean,
  ): Promise<Tag | null> {
    const incompleteTag = await this.tagModel
      .findOne({
        user: user._id,
        study: study._id,
        complete: false,
        isTraining: fromTrainingSet,
      })
      .populate('user')
      .populate('response')
      .populate('study')
      .exec();

    return incompleteTag;
  }

  /**
   * Update the provided tag in the database.
   *
   * @param tag The tag to update
   */
  async save(tag: Tag) {
    await this.tagModel.findOneAndUpdate({ _id: tag._id }, tag).exec();
  }

  /**
   * Delete any tag that may be related to the given response
   */
  async deleteResponse(response: Response) {
    this.tagModel
      .deleteMany({
        response: response._id,
      })
      .exec();
  }
}
