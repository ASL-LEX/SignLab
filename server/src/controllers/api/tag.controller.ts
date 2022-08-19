import { Controller, Get, HttpStatus, Query, HttpException, Post, Body } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { StudyService } from '../../services/study.service';
import { TagService } from '../../services/tag.service';
import { ResponseStudyService } from '../../services/responsestudy.service';
import { Tag } from '../../../../shared/dtos/tag.dto';

@Controller('/api/tag')
export class TagController {

  constructor(private userService: UserService,
              private studyService: StudyService,
              private tagService: TagService,
              private responseStudyService: ResponseStudyService) { }

  /**
   * Assign a tag to the given user for the given study. This will do one
   * of three things.
   *
   * 1. If the user has a tag for this study they have not yet completed,
   *    return back that incomplete tag
   * 2. If there is no responses left untagged for this study return null
   * 3. Otherwise create a new tag for the user to complete
   */
  @Get('/assign')
  async getNextTag(@Query('userID') userID: string, @Query('studyID') studyID: string): Promise<Tag | null> {
    // Ensure the user exists
    const user = await this.userService.find(userID);
    if (!user) {
      throw new HttpException(`User with ID '${userID}' not found`, HttpStatus.BAD_REQUEST);
    }

    // Ensure the study exists
    const study = await this.studyService.find(studyID);
    if (!study) {
      throw new HttpException(`Study with ID '${studyID}' not found`, HttpStatus.BAD_REQUEST);
    }

    // Check if the user already has an assigned tag for the study
    const incompleteTag = await this.tagService.getIncompleteTag(user, study);
    if (incompleteTag) {
      return incompleteTag;
    }

    // Find the next response without a tag in this study
    const nextResponseStudy = await this.responseStudyService.getAndMarkTagged(study);

    // If there is no next response study, return null
    if(!nextResponseStudy) {
      return null;
    }

    // Create a new tag
    return await this.tagService.createTag(user, nextResponseStudy.response, study);
  }

  /**
   * Add in the missing data to the tag and mark the tag as complete. Will
   * first validate that the fields in the tag match the expected schema.
   */
  @Post('/complete')
  async completeTag(@Body() tag: Tag) {
    // First validate tag against study's schema
    const validationResults = this.studyService.validate(tag);
    if(validationResults.errors.length > 0) {
      throw new HttpException(validationResults.errors, HttpStatus.BAD_REQUEST);
    }

    // Save the tag
    // TODO: Ensure this tag actually exists and is valid
    tag.complete = true;
    this.tagService.save(tag);
  }
}
