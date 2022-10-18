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
import { UserService } from '../user/user.service';
import { StudyService } from '../study/study.service';
import { TagService } from '../tag/tag.service';
import { EntryStudyService } from '../entrystudy/entrystudy.service';
import { Tag } from 'shared/dtos/tag.dto';
import { UserStudyService } from '../userstudy/userstudy.service';
import { TagGuard } from './tag.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('/api/tag')
export class TagController {
  constructor(
    private userService: UserService,
    private studyService: StudyService,
    private tagService: TagService,
    private entryStudyService: EntryStudyService,
    private userStudyService: UserStudyService,
  ) {}

  /**
   * Assign a tag to the given user for the given study. This will do one
   * of three things.
   *
   * 1. If the user has a tag for this study they have not yet completed,
   *    return back that incomplete tag
   * 2. If there is no entries left untagged for this study return null
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

    // Find the next entry without a tag in this study
    const nextEntryStudy = await this.entryStudyService.getAndMarkTagged(study);

    // If there is no next entry study, return null
    if (!nextEntryStudy) {
      return null;
    }

    // Create a new tag
    return this.tagService.createTag(user, nextEntryStudy.entry, study);
  }

  /**
   * Get the next tag that is part of the training for the given study. This
   * will first check for an incomplete training tag before getting the next
   * entry to tag.
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
    const nextTrainingEntryStudy =
      await this.userStudyService.getNextTrainingEntryStudy(user, study);
    if (!nextTrainingEntryStudy) {
      return null;
    }

    // Create a new tag
    return this.tagService.createTrainingTag(
      user,
      nextTrainingEntryStudy.entry,
      study,
    );
  }

  /**
   * Mark a given tag as complete. This will remove the cooresponding
   * entry from the user's list of entries to complete as part of their
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
