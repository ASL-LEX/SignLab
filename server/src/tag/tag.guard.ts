import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { StudyService } from '../study/study.service';
import { UserService } from '../user/user.service';

/**
 * Check to see if the given user has access to tag on a given study.
 */
@Injectable()
export class TagGuard implements CanActivate {
  constructor(private userService: UserService, private studyService: StudyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const query = context.switchToHttp().getRequest().query;
    const body = context.switchToHttp().getRequest().body;

    // Try to pull out the userID from either the query or the body
    let userID: string | undefined = undefined;
    let studyID: string | undefined = undefined;

    if (query.userID && query.studyID) {
      userID = query.userID;
      studyID = query.studyID;
    } else if (body.user && body.study) {
      userID = body.user._id;
      studyID = body.study._id;
    }

    // Ensure the correct parameters are provided
    if (userID == undefined || studyID == undefined) {
      throw new HttpException('userID and studyID must be present', HttpStatus.BAD_REQUEST);
    }

    // TODO: This logic is repeated in the functions that make use of this
    //       guard, should see if there is a better approach that doesn't
    //       involve making the query again
    // Ensure the user exists
    const user = await this.userService.findOne({ _id: userID });
    if (!user) {
      throw new HttpException(`User with ID '${query.userID}' not found`, HttpStatus.BAD_REQUEST);
    }

    // Ensure the study exists
    const study = await this.studyService.find(studyID);
    if (!study) {
      throw new HttpException(`Study with ID '${query.studyID}' not found`, HttpStatus.BAD_REQUEST);
    }

    // Check against the user roles
    return !!user.roles.studyContributor.get(study._id!);
  }
}
