import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserStudy, UserStudyDocument } from '../schemas/userstudy.schema';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Study } from '../schemas/study.schema';
import { ResponseStudyService } from './responsestudy.service';
import { ResponseStudy } from '../schemas/responsestudy.schema';

@Injectable()
export class UserStudyService {
  constructor(
    @InjectModel(UserStudy.name)
    private userStudyModel: Model<UserStudyDocument>,
    private responseStudyService: ResponseStudyService,
  ) {}

  /**
   * Make a user study for the given user and study
   */
  async create(user: User, study: Study): Promise<UserStudy> {
    const trainingResponseStudies =
      await this.responseStudyService.getTrainingSet(study);
    const newUserStudy: UserStudy = {
      user: user,
      study: study,
      trainingResponseStudies: trainingResponseStudies,
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
      .populate('trainingResponseStudies')
      .exec();
    if (userStudy) {
      return userStudy;
    }

    // Otherwise, make a new user study
    return this.create(user, study);
  }

  /**
   * Get the next response study for a given user that coorespondes to the
   * next response the user needs to tag as part of their training. If no
   * more training responses are present, null is returned.
   */
  async getNextTrainingResponseStudy(
    user: User,
    study: Study,
  ): Promise<ResponseStudy | null> {
    const userStudy = await this.getUserStudy(user, study);
    return userStudy.trainingResponseStudies.length == 0
      ? null
      : userStudy.trainingResponseStudies[0];
  }

  /**
   * Get all UserStudies for the given study.
   */
  async getUserStudies(study: Study): Promise<UserStudy[]> {
    return this.userStudyModel
      .find({
        study: study._id!,
      })
      .populate('trainingResponseStudies')
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
   * Mark the given tag as completed. This will remove the first response in the
   * user's list of ResponseStudies.
   *
   * NOTE: This method assumes that the tag is for the first response in the
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
          $pop: { trainingResponseStudies: -1 },
        },
      )
      .exec();
  }
}
