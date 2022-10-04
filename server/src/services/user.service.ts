import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

/**
 * The user service handles interactions with users that is not directly
 * authentication basic. This is for things like getting user information,
 * changing user roles, etc.
 */
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Get user based on User ID. Will return null if no user with that ID is
   * found.
   */
  async find(userID: string): Promise<User | null> {
    return this.userModel
      .findOne({
        _id: userID,
      })
      .exec();
  }

  /**
   * Get all users in the system. This will return all user information.
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Get all users that have the given roles
   */
  async getByRole(role: string): Promise<User[]> {
    return this.userModel.find({
      [`roles.${role}`]: true
    }).exec();
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
  private async setHasRole(
    role: string,
    id: string,
    hasRole: boolean,
  ): Promise<boolean> {
    // Find the user and update
    try {
      const user = await this.userModel
        .findOneAndUpdate({ _id: id }, { $set: { [`roles.${role}`]: hasRole } })
        .exec();

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
