import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Study } from '../study/study.schema';
import { User, UserDocument } from './user.schema';
import { ProjectAdminChangeFull } from '../project/project.dto';
import { Project } from '../project/project.schema';

/**
 * The user service handles interactions with users that is not directly
 * authentication basic. This is for things like getting user information,
 * changing user roles, etc.
 */
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Find a single user based on the query provided
   */
  async findOne(query: FilterQuery<User>): Promise<User | null> {
    return this.userModel.findOne(query).exec();
  }

  /**
   * Get all users in the system. This will return all user information.
   */
  async findAll(query: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(query).exec();
  }

  /**
   * Get all users that have the given roles
   */
  async getByRole(role: string): Promise<User[]> {
    return this.userModel
      .find({
        [`roles.${role}`]: true
      })
      .exec();
  }

  /**
   * Get the number of users registered in the system
   */
  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  /**
   * Make a new user in the system where the ID is not provided.
   */
  async create(user: Pick<User, Exclude<keyof User, '_id'>>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  /**
   * Add a role to the given user
   *
   * @param role The role to add to the user
   * @param id The ID of the user to add the role to
   * @return True if the user exists (and can thus have a role added) false otherwise
   */
  async addRole(role: string, id: string): Promise<boolean> {
    return this.setHasRole(role, id, true);
  }

  /**
   * Remove the role from the given user
   *
   * @param role The role to remove from the user
   * @param id The ID of the user to remove the role from
   * @return True if the user exists and the role was remvoed
   */
  async removeRole(role: string, id: string): Promise<boolean> {
    return this.setHasRole(role, id, false);
  }

  /**
   * Set if the user is an admin for a given project or not
   */
  async markAsProjectAdmin(adminChange: ProjectAdminChangeFull): Promise<void> {
    await this.userModel
      .findOneAndUpdate(
        { _id: adminChange.user._id },
        {
          $set: {
            [`roles.projectAdmin.${adminChange.project._id!}`]: adminChange.hasAdminAccess
          }
        }
      )
      .exec();
  }

  /**
   * Set if the user is an admin for a given study or not
   */
  async markAsStudyAdmin(user: User, study: Study, isAdmin: boolean): Promise<void> {
    await this.userModel
      .findOneAndUpdate({ _id: user._id }, { $set: { [`roles.studyAdmin.${study._id!}`]: isAdmin } })
      .exec();
  }

  /** Set if the user can view a given study */
  async markAsVisible(user: User, study: Study, isVisible: boolean): Promise<void> {
    await this.userModel
      .findOneAndUpdate({ _id: user._id }, { $set: { [`roles.studyVisible.${study._id!}`]: isVisible } })
      .exec();
  }

  /**
   * Set if the user can contribute to the study or not
   */
  async markAsContributor(user: User, study: Study, canContribute: boolean): Promise<void> {
    await this.userModel
      .findOneAndUpdate({ _id: user._id }, { $set: { [`roles.studyContributor.${study._id!}`]: canContribute } })
      .exec();
  }

  /** Remove project information from all users */
  async removeProjectRole(project: Project) {
    // Remove project admin deliniation
    await this.userModel
      .updateMany(
        { [`roles.projectAdmin.${project._id}`]: { $exists: true } },
        { $unset: { [`roles.projectAdmin.${project._id}`]: '' } }
      )
      .exec();
  }

  /** Remove study information for all users */
  async removeStudyRole(study: Study) {
    await Promise.all([
      // Remove study admin deliniation
      this.userModel
        .updateMany(
          { [`roles.studyAdmin.${study._id}`]: { $exists: true } },
          { $unset: { [`roles.studyAdmin.${study._id}`]: '' } }
        )
        .exec(),
      // Remove the study visible deliniation
      this.userModel
        .updateMany(
          { [`roles.studyVisible.${study._id}`]: { $exists: true } },
          { $unset: { [`roles.studyVisible.${study._id}`]: '' } }
        )
        .exec(),
      // Remove the study contributor deliniation
      this.userModel
        .updateMany(
          { [`roles.studyContributor.${study._id}`]: { $exists: true } },
          { $unset: { [`roles.studyContributor.${study._id}`]: '' } }
        )
        .exec()
    ]);
  }

  /**
   * Set the state of the role as having the role (true) or not having
   * the role (false).
   *
   * Will return false if the user role was not updated
   *
   * @param role The role to modify for the user
   * @param id The id of the user
   * @param hasRole If the user will have the role or not
   * @return True if the role was updated successfully
   */
  private async setHasRole(role: string, id: string, hasRole: boolean): Promise<boolean> {
    // Find the user and update
    try {
      const user = await this.userModel.findOneAndUpdate({ _id: id }, { $set: { [`roles.${role}`]: hasRole } }).exec();

      if (!user) {
        return false;
      }

      // All is well
      return true;
    } catch (err) {
      // If an error occurred, return failure
      console.log(err);
      return false;
    }
  }
}
