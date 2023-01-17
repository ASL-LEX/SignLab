import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { StudyService } from '../study/study.service';

/**
 * The study guard is for checking if a user has admin privledges for a
 * specific study.
 *
 * Required Conditions:
 * 1. `userID` is present on request body
 * 2. `studyID` is present on request body
 * 3. User is either an owner or admin of the parent project or admin of the study
 */
@Injectable()
export class StudyGuard implements CanActivate {
  constructor(private readonly studyService: StudyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const body = context.switchToHttp().getRequest().body;

    // If the study is not attached, cannot activate
    if (!body.studyID) {
      return false;
    }

    // Get the study from the database and determine the associated project
    const study = await this.studyService.find(body.studyID);
    if (!study) {
      console.error(`Study with ID ${body.studyID} not found`);
      return false;
    }
    const projectID = study.project.toString();

    // Get the user from the request
    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      console.debug('StudyGuard: no user');
      return false;
    }

    return (
      user.roles.owner ||
      user.roles.projectAdmin[projectID] ||
      user.roles.studyAdmin[body.studyID]
    );
  }
}
