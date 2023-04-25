import {
  Controller,
  Get,
  HttpStatus,
  Query,
  HttpException,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { StudyService } from '../study/study.service';
import { TagService } from '../tag/tag.service';
import { EntryStudyService } from '../entrystudy/entrystudy.service';
import { Tag } from './tag.schema';
import { UserStudyService } from '../userstudy/userstudy.service';
import { TagGuard } from './tag.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserPipe } from '../shared/pipes/user.pipe';
import { StudyPipe } from '../shared/pipes/study.pipe';
import { User } from '../user/user.schema';
import { Study } from '../study/study.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { BucketStorage } from '../bucket/bucket.service';
import { DatasetService } from '../dataset/dataset.service';
import { EntryService } from '../entry/entry.service';

@Controller('/api/tag')
export class TagController {
  constructor(
    private studyService: StudyService,
    private tagService: TagService,
    private entryStudyService: EntryStudyService,
    private userStudyService: UserStudyService,
    private bucketService: BucketStorage,
    private datasetService: DatasetService,
    private entryService: EntryService
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
    @Query('userID', UserPipe) user: User,
    @Query('studyID', StudyPipe) study: Study
  ): Promise<Tag | null> {
    // Check if the user already has an assigned tag for the study
    const incompleteTag = await this.tagService.getIncompleteTag(user, study);
    if (incompleteTag) {
      return incompleteTag;
    }

    // Find the next entry without a tag in this study
    const nextEntryStudy = await this.entryStudyService.getAndMarkTagged(study, user);

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
    @Query('userID', UserPipe) user: User,
    @Query('studyID', StudyPipe) study: Study
  ): Promise<Tag | null> {
    // Check if the user has an incomplete training tag first
    const incompleteTag = await this.tagService.getIncompleteTrainingTag(user, study);
    if (incompleteTag) {
      return incompleteTag;
    }

    // Otherwise make a new training tag
    const nextTrainingEntryStudy = await this.userStudyService.getNextTrainingEntryStudy(user, study);
    if (!nextTrainingEntryStudy) {
      return null;
    }

    // Create a new tag
    return this.tagService.createTrainingTag(user, nextTrainingEntryStudy.entry, study);
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
    tag.complete = true;
    const updatedTag = await this.tagService.save(tag);

    // Handle adding the tag to the list of tags on the entry study
    this.entryStudyService.addTag(updatedTag);
  }

  /**
   * Get all complete tag information for a given study.
   *
   * NOTE: This is a temporary function which exists to allow for easy
   *       exporting of tag information. In later versions this will be
   *       replaces by a more flexible view users can export from.
   */
  @Get('/forStudy')
  async getTagsForStudy(@Query('studyID', StudyPipe) study: Study): Promise<Tag[]> {
    return this.tagService.getCompleteTags(study);
  }

  /**
   * Get all complete training tags for the given user and study
   */
  @Get('/training')
  async getTrainingTags(
    @Query('studyID', StudyPipe) study: Study,
    @Query('userID', UserPipe) user: User
  ): Promise<Tag[]> {
    return this.tagService.getCompleteTrainingTags(user, study);
  }

  /**
   * Save a video that is part of a tag. This will store the video in a
   * bucket
   *
   * @param tagStr The tag that the video is being recorded for
   * @param field The field in the tag form this video is for
   * @param datasetID The dataset to save into
   * @param videoNumber The number of the video in the field being recorded
   */
  @Post('/video_field')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideoField(
    @UploadedFile() file: Express.Multer.File,
    @Body('tag') tagStr: string,
    @Body('field') field: string,
    @Body('datasetID') datasetID: string,
    @Body('videoNumber') videoNumber: number
  ): Promise<{ uri: string }> {
    const tagID = JSON.parse(tagStr)._id;

    // Ensure the tag exists
    const existingTag = await this.tagService.find(tagID);
    if (!existingTag) {
      throw new HttpException(`Tag with ID '${tagID}' not found`, HttpStatus.BAD_REQUEST);
    }

    // Ensure the field exists
    if (!existingTag.study.tagSchema.dataSchema.properties[field]) {
      throw new HttpException(`Field '${field}' not found on tag`, HttpStatus.BAD_REQUEST);
    }

    // Ensure that the dataset that is the target exists
    const dataset = await this.datasetService.findOne({ _id: datasetID });
    if (dataset === null) {
      throw new HttpException(`Dataset with ID ${datasetID} not found`, HttpStatus.NOT_FOUND);
    }

    // URL encode the fieldname for saving the video in the bucket
    const encodedField = encodeURIComponent(field);

    // Save the file
    const fileExtension = file.originalname.split('.').pop();
    const target = `Tag/videos/${existingTag._id}/${videoNumber}/${encodedField}.${fileExtension}`;
    const video = await this.bucketService.objectUpload(file.buffer, target);

    // Only make entries of non-tagging videos
    if (!existingTag.isTraining) {
      // Make a new entry for the saved video if the entry does not already
      // exist
      const existingEntry = await this.entryService.find({
        dataset: datasetID,
        'signLabRecording.tag': existingTag._id,
        'signLabRecording.fieldName': field,
        'signLabRecording.videoNumber': videoNumber
      });
      if (existingEntry === null) {
        // TODO: Remove concept of the `entryID`
        const entry = await this.entryService.createEntry({
          entryID: 'TODO: Remove entryID',
          mediaURL: video.uri,
          mediaType: 'video',
          recordedInSignLab: true,
          dataset: dataset,
          creator: existingTag.user,
          dateCreated: new Date(),
          signLabRecording: {
            tag: existingTag,
            fieldName: field,
            videoNumber: videoNumber
          },
          // TODO: Make it so validation does not run on metadata for entries
          //       recorded in SignLab
          meta: {
            prompt: 'placeholder',
            responderID: existingTag.user._id
          }
        });

        const studies = await this.studyService.getAllStudies();
        const entries = [entry];
        Promise.all(
          studies.map(async (study) => {
            return this.entryStudyService.createEntryStudies(entries, study, false);
          })
        );
      }
    }

    // Make the cooresponding entry studies
    return { uri: video.uri };
  }
}
