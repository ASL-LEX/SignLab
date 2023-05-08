import {
  Controller,
  Post,
  Get,
  Put,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Body,
  Query,
  Delete,
  Param
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EntryService } from './entry.service';
import { Readable } from 'stream';
import { diskStorage } from 'multer';
import { SaveAttempt } from 'shared/dtos/entry.dto';
import { SchemaService } from './schema.service';
import { EntryUploadService } from './entry-upload.service';
import { StudyService } from '../study/study.service';
import { EntryStudyService } from '../entrystudy/entrystudy.service';
import { EntryStudy } from '../entrystudy/entrystudy.schema';
import { Auth } from '../auth/auth.guard';
import { TagService } from '../tag/tag.service';
import { UserStudyService } from '../userstudy/userstudy.service';
import { BucketStorage } from '../bucket/bucket.service';
import { StudyPipe } from '../shared/pipes/study.pipe';
import { Study } from '../study/study.schema';
import { EntryPipe } from '../shared/pipes/entry.pipe';
import { Entry } from './entry.schema';
import { DatasetPipe } from '../shared/pipes/dataset.pipe';
import { Dataset } from '../dataset/dataset.schema';
import { UserPipe } from '../shared/pipes/user.pipe';
import { User } from '../user/user.schema';
import { OrganizationContext } from '../organization/organization.decorator';
import { Organization } from '../organization/organization.schema';

@Controller('/api/entry')
export class EntryController {
  constructor(
    private entryService: EntryService,
    private schemaService: SchemaService,
    private entryUploadService: EntryUploadService,
    private studyService: StudyService,
    private entryStudyService: EntryStudyService,
    private tagService: TagService,
    private userStudyService: UserStudyService,
    private bucketStorage: BucketStorage
  ) {}

  /**
   * Handles the process of uploading entries to SignLab. This process
   * includes the following.
   *
   * 1. Parsing a CSV and ensuring all required fields are present
   * 2. Creating EntryUpload entities in the database
   * 3. Handling video uploading to bucket storage
   * 4. For each video uploaded, move the EntryUpload entity into a full
   *    Entry
   *
   * @param file The CSV that needs to be parsed
   * @return The results of attempting to make the save with any associated
   *         error messages
   */
  @Post('/upload/csv')
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSV(@UploadedFile() file: Express.Multer.File): Promise<SaveAttempt> {
    // TODO: Add error handling on file type
    // Make a stream from the buffer in the file
    const fileStream = Readable.from(file.buffer);
    return this.entryUploadService.uploadEntryDataCSV(fileStream);
  }

  /**
   * Download the template which the user can use for uploading new
   * entries.
   */
  @Get('/template')
  @Auth('admin')
  async getEntryCSVTemplate(): Promise<{ header: string }> {
    // Header with required arguments
    let header = 'entryID,responderID,filename';

    // Add in user provided metadata
    for (const metadata of await this.schemaService.getFields('Entry')) {
      header += ',';
      header += metadata;
    }

    return { header: header };
  }

  /**
   * Get the entries for the given dataset
   */
  @Get('/dataset/:datasetID')
  @Auth('admin')
  async getEntriesForDataset(@Param('datasetID', DatasetPipe) dataset: Dataset): Promise<Entry[]> {
    return this.entryService.getEntriesForDataset(dataset);
  }

  /**
   * Set the dataset that the next series of entries will be uploaded to.
   * This should be called first before uploading the metadat
   */
  @Put('/upload/dataset/:datasetID')
  @Auth('admin')
  setTargetDataset(@Param('datasetID', DatasetPipe) dataset: Dataset) {
    this.entryUploadService.setTargetDataset(dataset);
  }

  /**
   * Set the user that is making the upload
   */
  @Put('/upload/user/:userID')
  @Auth('admin')
  setUser(@Param('userID', UserPipe) user: User) {
    this.entryUploadService.setTargetUser(user);
  }

  /**
   * Handles uploading the ZIP file containing all of the entry videos
   * to SignLab. This must take place after a request to
   * `/api/entry/upload/csv` otherwise the call will quickly error out
   * when corresponding EntryUpload data is not found to coorespond
   * with the videos.
   *
   * @param _file The zip file that was uploaded and saved
   * @return The result of attempting to make the save with any associated
   *         error messages.
   */
  @Post('/upload/zip')
  @Auth('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      // @Auth('admin')
      storage: diskStorage({
        destination: './upload/',
        filename: (_req, _file, cb) => {
          cb(null, 'upload.zip');
        }
      })
    })
  )
  async uploadZIP(
    @UploadedFile() _file: Express.Multer.File,
    @OrganizationContext() organization: Organization
  ): Promise<SaveAttempt> {
    // TODO: Add error handling on file type
    const result = await this.entryUploadService.uploadEntryVideos('./upload/upload.zip', organization);

    // Now create a EntryStudy for each entry for each study
    if (result.entries) {
      const studies = await this.studyService.getAllStudies(organization._id);
      await Promise.all(
        studies.map(async (study) => {
          this.entryStudyService.createEntryStudies(result.entries, study, true);
        })
      );
    }

    return result.saveResult;
  }

  /**
   * Get all entry information
   */
  @Get('/')
  @Auth('admin')
  async getEntries(@OrganizationContext() organization: Organization): Promise<Entry[]> {
    return this.entryService.getAllEntries(organization._id);
  }

  /**
   * Get the entry studies for a specific study.
   */
  @Get('/entriestudies')
  @Auth('admin')
  async getEntryStudies(
    @Query('studyID', StudyPipe) study: Study,
    @Query('datasetID', DatasetPipe) dataset: Dataset
  ): Promise<EntryStudy[]> {
    return this.entryStudyService.getEntryStudies(study, dataset);
  }

  /**
   * Change if the entry should be enabled as part of the study.
   */
  @Put('/enable')
  @Auth('admin')
  async setEntryStudyEnable(
    @Body()
    changeRequest: {
      studyID: string;
      entryID: string;
      isPartOfStudy: boolean;
    }
  ): Promise<void> {
    // Get the study and entry
    // TODO: Standardized this process of existence checking and querying
    const study = await this.studyService.find(changeRequest.studyID);
    if (!study) {
      throw new HttpException(`The study with id ${changeRequest.studyID} does not exist`, HttpStatus.BAD_REQUEST);
    }
    const entry = await this.entryService.find({ _id: changeRequest.entryID });
    if (!entry) {
      throw new HttpException(`The entry with id ${changeRequest.entryID} does not exist`, HttpStatus.BAD_REQUEST);
    }

    // This would be bad if the entry study does not exist since the
    // EntryStudy should exist if the entry and study both exist.
    // This would either be a bug in the code, or someone was poking around the
    // DB and did something bad.
    const entryStudy = await this.entryStudyService.find(entry, study);
    if (!entryStudy) {
      throw new HttpException(
        `Something went wrong trying to find the entry study information`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    this.entryStudyService.changePartOfStudy(entryStudy, changeRequest.isPartOfStudy);
  }

  /**
   * Delete the given entry. This will also have the effect of deleting
   * the entry's relation to any study as well as any tags that may
   * exist for the entry.
   *
   * @param entry The entry to delete
   */
  @Delete('/:id')
  @Auth('admin')
  async deleteEntry(@Param('id', EntryPipe) entry: Entry): Promise<void> {
    // First, handle the case that the entry is part of the training set,
    // this will remove the corresponding entry studies from the list of
    // training set
    const entryStudies = await this.entryStudyService.findMany(entry);
    for (const entryStudy of entryStudies) {
      // If it is part of training, remove it from the cooresponding
      // UserStudies training set
      if (entryStudy.isUsedForTraining) {
        this.userStudyService.removeTraining(entryStudy);
      }
    }

    // Delete any tag related to the entry, remove the relation between
    // entry and study, and remove the entry itself
    this.tagService.deleteEntry(entry);
    this.entryStudyService.deleteEntry(entry);
    this.entryService.delete(entry);

    // Now remove the entry from the bucket
    this.bucketStorage.objectDelete(entry.mediaURL);
  }
}
