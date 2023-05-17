import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Study } from '../study/study.schema';
import { User } from '../user/user.schema';
import { Tag, TagDocument } from './tag.schema';
import { Entry } from '../entry/entry.schema';
import { EntryService } from '../entry/entry.service';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    private readonly entryService: EntryService
  ) {}

  /**
   * Get the tag with the given id
   */
  async find(id: string): Promise<Tag | null> {
    return this.tagModel.findById(id).populate('study').populate('user').exec();
  }

  /**
   * Make a new tag for the given user, study, and entry. When the tag is
   * created, it is considered incomplete
   *
   * @param user The user who will complete the tag
   * @param entry The entry that the tag is associated with
   * @param study The study the tag is for
   * @return A new tag
   */
  async createTag(user: User, entry: Entry, study: Study): Promise<Tag> {
    return this.tagModel.create({
      entry: entry,
      study: study,
      user: user,
      complete: false,
      isTraining: false
    });
  }

  /**
   * Make a new training tag. When this tag is created it is considered
   * incomplete.
   */
  async createTrainingTag(user: User, entry: Entry, study: Study): Promise<Tag> {
    const result = await (
      await this.tagModel.create({
        entry: entry,
        study: study,
        user: user,
        complete: false,
        isTraining: true
      })
    ).populate('entry');

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
        isTraining: false
      })
      .populate('user')
      .populate('study')
      .populate('entry')
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
        user: user._id
      })
      .populate('user')
      .populate('study')
      .populate('entry')
      .exec();
  }

  /**
   * Find a entry and tag that the given user has yet to complete for
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
   * Find a entry and tag for the given user that was incomplete as part
   * of the training for a specific study.
   */
  async getIncompleteTrainingTag(user: User, study: Study): Promise<Tag | null> {
    return this.getIncompleteTagGeneric(user, study, true);
  }

  /**
   * Find a entry and tag that the user has yet to complete either
   * from the normal data set or the training data set.
   */
  private async getIncompleteTagGeneric(user: User, study: Study, fromTrainingSet: boolean): Promise<Tag | null> {
    const incompleteTag = await this.tagModel
      .findOne({
        user: user._id,
        study: study._id,
        complete: false,
        isTraining: fromTrainingSet
      })
      .populate('user')
      .populate('entry')
      .populate('study')
      .exec();

    return incompleteTag;
  }

  /**
   * Update the provided tag in the database.
   *
   * @param tag The tag to update
   */
  async save(tag: Tag): Promise<Tag> {
    const result = await this.tagModel
      .findOneAndUpdate({ _id: tag._id }, tag)
      .populate('study')
      .populate('entry')
      .exec();
    if (!result) {
      throw new BadRequestException(`Tag with id ${tag._id} does not exist`);
    }
    return result;
  }

  /**
   * Delete any tag that may be related to the given entry
   */
  async deleteEntry(entry: Entry) {
    this.tagModel
      .deleteMany({
        entry: entry._id
      })
      .exec();
  }

  async deleteForStudy(study: Study): Promise<void> {
    // Determine what tags are impacted
    const tags = await this.tagModel.find({ study: study._id });

    // Remove the tags
    await this.tagModel.deleteMany({ study: study._id });

    // Remove each tag relation for any impacted entity
    await Promise.all(
      tags.map(async (tag) => {
        await this.entryService.removeTag(tag);
      })
    );
  }
}
