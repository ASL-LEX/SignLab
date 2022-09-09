import {
  Controller,
  Get,
  HttpStatus,
  Query,
  HttpException,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { StudyService } from '../../services/study.service';
import { TagService } from '../../services/tag.service';
import { ResponseStudyService } from '../../services/responsestudy.service';
import { Tag } from 'shared/dtos/tag.dto';
import { UserStudyService } from '../../services/userstudy.service';
import { TagGuard } from '../../guards/tag.guard';
import { JwtAuthGuard } from '../../guards/jwt.guard';

@Controller('/api/tag')
export class TagController {
  constructor(
    private userService: UserService,
    private studyService: StudyService,
    private tagService: TagService,
    private responseStudyService: ResponseStudyService,
    private userStudyService: UserStudyService,
  ) {}

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
  @UseGuards(JwtAuthGuard, TagGuard)
  async getNextTag(
    @Query('userID') userID: string,
    @Query('studyID') studyID: string,
  ): Promise<Tag | null> {
    // Ensure the user exists
    const user = await this.userService.find(userID);
    if (!user) {
      throw new HttpException(
        `User with ID '${userID}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Ensure the study exists
    const study = await this.studyService.find(studyID);
    if (!study) {
      throw new HttpException(
        `Study with ID '${studyID}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the user already has an assigned tag for the study
    const incompleteTag = await this.tagService.getIncompleteTag(user, study);
    if (incompleteTag) {
      return incompleteTag;
    }

    // Find the next response without a tag in this study
    const nextResponseStudy = await this.responseStudyService.getAndMarkTagged(
      study,
    );

    // If there is no next response study, return null
    if (!nextResponseStudy) {
      return null;
    }

    // Create a new tag
    return this.tagService.createTag(user, nextResponseStudy.response, study);
  }

  /**
   * Get the next tag that is part of the training for the given study. This
   * will first check for an incomplete training tag before getting the next
   * response to tag.
   */
  @Get('/nextTraining')
  async getNextTrainingTag(
    @Query('userID') userID: string,
    @Query('studyID') studyID: string,
  ): Promise<Tag | null> {
    // Ensure the user exists
    const user = await this.userService.find(userID);
    if (!user) {
      throw new HttpException(
        `User with ID '${userID}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Ensure the study exists
    const study = await this.studyService.find(studyID);
    if (!study) {
      throw new HttpException(
        `Study with ID '${studyID}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the user has an incomplete training tag first
    const incompleteTag = await this.tagService.getIncompleteTrainingTag(
      user,
      study,
    );
    if (incompleteTag) {
      return incompleteTag;
    }

    // Otherwise make a new training tag
    const nextTrainingResponseStudy =
      await this.userStudyService.getNextTrainingResponseStudy(user, study);
    if (!nextTrainingResponseStudy) {
      return null;
    }

    // Create a new tag
    return this.tagService.createTrainingTag(
      user,
      nextTrainingResponseStudy.response,
      study,
    );
  }

  /**
   * Mark a given tag as complete. This will remove the cooresponding
   * response from the user's list of responses to complete as part of their
   * training.
   */
  @Post('/completeTraining')
  async complateTrainingTag(@Body() tag: Tag) {
    // First validate tag against study's schema
    const validationResults = this.studyService.validate(tag);
    if (validationResults.errors.length > 0) {
      throw new HttpException(validationResults.errors, HttpStatus.BAD_REQUEST);
    }

    tag.complete = true;
    this.userStudyService.markTrainingTagComplete(tag.user, tag.study);
    this.tagService.save(tag);
  }

  /**
   * Add in the missing data to the tag and mark the tag as complete. Will
   * first validate that the fields in the tag match the expected schema.
   */
  @Post('/complete')
  @UseGuards(TagGuard)
  async completeTag(@Body() tag: Tag) {
    // First validate tag against study's schema
    const validationResults = this.studyService.validate(tag);
    if (validationResults.errors.length > 0) {
      throw new HttpException(validationResults.errors, HttpStatus.BAD_REQUEST);
    }

    // Save the tag
    // TODO: Ensure this tag actually exists and is valid
    tag.complete = true;
    this.tagService.save(tag);
  }

  /**
   * Get all complete tag information for a given study.
   *
   * NOTE: This is a temporary function which exists to allow for easy
   *       exporting of tag information. In later versions this will be
   *       replaces by a more flexible view users can export from.
   */
  @Get('/forStudy')
  async getTagsForStudy(@Query('studyID') studyID: string): Promise<Tag[]> {
    // Ensure the study exists
    const study = await this.studyService.find(studyID);
    if (!study) {
      throw new HttpException(
        `Study with ID '${studyID}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.tagService.getCompleteTags(study);
  }

  /**
   * Get all complete training tags for the given user and study
   */
  @Get('/training')
  async getTrainingTags(
    @Query('studyID') studyID: string,
    @Query('userID') userID: string,
  ): Promise<Tag[]> {
    // Ensure the user exists
    const user = await this.userService.find(userID);
    if (!user) {
      throw new HttpException(
        `User with ID '${userID}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Ensure the study exists
    const study = await this.studyService.find(studyID);
    if (!study) {
      throw new HttpException(
        `Study with ID '${studyID}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.tagService.getCompleteTrainingTags(user, study);
  }
}
