import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserStudy, UserStudyDocument } from './userstudy.schema';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { Study } from '../study/study.schema';
import { EntryStudyService } from '../entrystudy/entrystudy.service';
import { EntryStudy } from '../entrystudy/entrystudy.schema';

@Injectable()
export class UserStudyService {
  constructor(
    @InjectModel(UserStudy.name)
    private userStudyModel: Model<UserStudyDocument>,
    private entryStudyService: EntryStudyService,
  ) {}

  /**
   * Make a user study for the given user and study
   */
  async create(user: User, study: Study): Promise<UserStudy> {
    const trainingEntryStudies = await this.entryStudyService.getTrainingSet(
      study,
    );
    const newUserStudy: UserStudy = {
      user: user,
      study: study,
      trainingEntryStudies: trainingEntryStudies,
      hasAccessToStudy: false,
    };

    await this.userStudyModel.create(newUserStudy);
    return newUserStudy;
  }

  /**
   * Get the UserStudy for the given user + study combination.
   *
   * If the user + study combination is not found, a new one will be created
   * and returned.
   */
  async getUserStudy(user: User, study: Study): Promise<UserStudy> {
    // First try to find an existing user study model
    const userStudy = await this.userStudyModel
      .findOne({
        user: user._id,
        study: study._id!,
      })
      .populate('user')
      .populate('study')
      .populate('trainingEntryStudies')
      .exec();
    if (userStudy) {
      return userStudy;
    }

    // Otherwise, make a new user study
    return this.create(user, study);
  }

  /**
   * Get the next entry study for a given user that coorespondes to the
   * next entry the user needs to tag as part of their training. If no
   * more training entrys are present, null is returned.
   */
  async getNextTrainingEntryStudy(
    user: User,
    study: Study,
  ): Promise<EntryStudy | null> {
    const userStudy = await this.getUserStudy(user, study);
    return userStudy.trainingEntryStudies.length == 0
      ? null
      : userStudy.trainingEntryStudies[0];
  }

  /**
   * Get all UserStudies for the given study.
   */
  async getUserStudies(study: Study): Promise<UserStudy[]> {
    return this.userStudyModel
      .find({
        study: study._id!,
      })
      .populate('trainingEntryStudies')
      .populate('user')
      .populate('study')
      .exec();
  }

  /**
   * Change if a given user has access to tag in the given study
   */
  async changeUserAccess(study: Study, user: User, hasAccess: boolean) {
    await this.userStudyModel
      .updateOne(
        {
          study: study._id!,
          user: user._id,
        },
        {
          hasAccessToStudy: hasAccess,
        },
      )
      .exec();
  }

  /**
   * Mark the given tag as completed. This will remove the first entry in the
   * user's list of EntryStudies.
   *
   * NOTE: This method assumes that the tag is for the first entry in the
   *       user's list. This should always be the case.
   */
  async markTrainingTagComplete(user: User, study: Study): Promise<void> {
    this.userStudyModel
      .updateOne(
        {
          user: user._id,
          study: study._id!,
        },
        {
          $pop: { trainingEntryStudies: -1 },
        },
      )
      .exec();
  }

  /**
   * Remove the given EntryStudy as a entry study that is part of
   * the training set. This will pull the EntryStudy id from the
   * `trainingEntryStudies` list on each user study
   */
  async removeTraining(entryStudy: EntryStudy) {
    this.userStudyModel
      .updateMany(
        {
          study: entryStudy.study._id,
        },
        {
          $pull: { trainingEntryStudies: entryStudy._id },
        },
      )
      .exec();
  }
}
