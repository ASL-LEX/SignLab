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
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseService } from '../../services/response.service';
import { Readable } from 'stream';
import { diskStorage } from 'multer';
import { Response } from '../../schemas/response.schema';
import { MetadataDefinition, SaveAttempt } from 'shared/dtos/response.dto';
import { SchemaService } from '../../services/schema.service';
import { ResponseUploadService } from '../../services/response-upload.service';
import { StudyService } from '../../services/study.service';
import { ResponseStudyService } from '../../services/responsestudy.service';
import { ResponseStudy } from 'shared/dtos/responsestudy.dto';
import { Auth } from '../../guards/auth.guard';
import { TagService } from '../../services/tag.service';
import { UserStudyService } from '../../services/userstudy.service';
import { BucketStorage } from '../../services/bucket/bucket.service';

@Controller('/api/response')
export class ResponseController {
  constructor(
    private responseService: ResponseService,
    private schemaService: SchemaService,
    private responseUploadService: ResponseUploadService,
    private studyService: StudyService,
    private responseStudyService: ResponseStudyService,
    private tagService: TagService,
    private userStudyService: UserStudyService,
    private bucketStorage: BucketStorage,
  ) {}

  /**
   * Handle storing the metadata schema which will be stored for
   * every response.
   *
   * NOTE: This is a one-time operation. Once the meta data is specified,
   *       it cannot be changed.
   */
  @Post('/metadata')
  async setMetadata(@Body() fields: MetadataDefinition[]) {
    // If the schema already exists, throw an error
    if (await this.schemaService.hasSchema('Response')) {
      throw new HttpException(
        'Response schema already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Generate a JSON Schmea from the meta data
    const schema = {
      $id: 'Response',
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {},
      required: fields.map((field) => field.name),
    };
    for (const field of fields) {
      (schema.properties as any)[field.name] = { type: field.type };
    }

    this.schemaService.saveSchema('Response', schema);
  }

  /**
   * Handles the process of uploading responses to SignLab. This process
   * includes the following.
   *
   * 1. Parsing a CSV and ensuring all required fields are present
   * 2. Creating ResponseUpload entities in the database
   * 3. Handling video uploading to bucket storage
   * 4. For each video uploaded, move the ResponseUpload entity into a full
   *    Response
   *
   * @param file The CSV that needs to be parsed
   * @return The results of attempting to make the save with any associated
   *         error messages
   */
  @Post('/upload/csv')
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSV(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SaveAttempt> {
    // TODO: Add error handling on file type
    // Make a stream from the buffer in the file
    const fileStream = Readable.from(file.buffer);
    return this.responseUploadService.uploadResponseDataCSV(fileStream);
  }

  /**
   * Download the template which the user can use for uploading new
   * responses.
   */
  @Get('/template')
  @Auth('admin')
  async getResponseCSVTemplate(): Promise<{ header: string }> {
    // Header with required arguments
    let header = 'responseID,responderID,filename';

    // Add in user provided metadata
    for (const metadata of await this.schemaService.getFields('Response')) {
      header += ',';
      header += metadata;
    }

    return { header: header };
  }

  /**
   * Handles uploading the ZIP file containing all of the response videos
   * to SignLab. This must take place after a request to
   * `/api/response/upload/csv` otherwise the call will quickly error out
   * when corresponding ResponseUpload data is not found to coorespond
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
        },
      }),
    }),
  )
  async uploadZIP(
    @UploadedFile() _file: Express.Multer.File,
  ): Promise<SaveAttempt> {
    // TODO: Add error handling on file type
    const result = await this.responseUploadService.uploadResponseVideos(
      './upload/upload.zip',
    );

    // Now create a ResponseStudy for each response for each study
    if (result.responses) {
      const studies = await this.studyService.getStudies();
      await Promise.all(
        studies.map(async (study) => {
          this.responseStudyService.createResponseStudies(
            result.responses,
            study,
          );
        }),
      );
    }

    return result.saveResult;
  }

  /**
   * Get all response information
   */
  @Get('/')
  @Auth('admin')
  async getResponses(): Promise<Response[]> {
    return this.responseService.getAllResponses();
  }

  /**
   * Get the response studies for a specific study.
   */
  @Get('/responsestudies')
  @Auth('admin')
  async getResponseStudies(
    @Query('studyID') studyID: string,
  ): Promise<ResponseStudy[]> {
    // Ensure that the service exists
    const study = await this.studyService.find(studyID);
    if (!study) {
      throw new HttpException(
        `The study with id ${studyID} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.responseStudyService.getResponseStudies(study);
  }

  /**
   * Change if the response should be enabled as part of the study.
   */
  @Put('/enable')
  @Auth('admin')
  async setResponseStudyEnable(
    @Body()
    changeRequest: {
      studyID: string;
      responseID: string;
      isPartOfStudy: boolean;
    },
  ): Promise<void> {
    // Get the study and response
    // TODO: Standardized this process of existence checking and querying
    const study = await this.studyService.find(changeRequest.studyID);
    if (!study) {
      throw new HttpException(
        `The study with id ${changeRequest.studyID} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const response = await this.responseService.find(changeRequest.responseID);
    if (!response) {
      throw new HttpException(
        `The response with id ${changeRequest.responseID} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // This would be bad if the response study does not exist since the
    // ResponseStudy should exist if the response and study both exist.
    // This would either be a bug in the code, or someone was poking around the
    // DB and did something bad.
    const responseStudy = await this.responseStudyService.find(response, study);
    if (!responseStudy) {
      throw new HttpException(
        `Something went wrong trying to find the response study information`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.responseStudyService.changePartOfStudy(
      responseStudy,
      changeRequest.isPartOfStudy,
    );
  }

  /**
   * Delete the given response. This will also have the effect of deleting
   * the response's relation to any study as well as any tags that may
   * exist for the response.
   *
   * @param responseID The database generated ID
   */
  @Delete('/:id')
  @Auth('admin')
  async deleteResponse(@Param('id') responseID: string): Promise<void> {
    const response = await this.responseService.find(responseID);
    if (!response) {
      throw new HttpException(
        `Response does not exist with that ID: ${responseID}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // First, handle the case that the response is part of the training set,
    // this will remove the corresponding response studies from the list of
    // training set
    const responseStudies = await this.responseStudyService.findMany(response);
    for (const responseStudy of responseStudies) {
      // If it is part of training, remove it from the cooresponding
      // UserStudies training set
      if (responseStudy.isUsedForTraining) {
        this.userStudyService.removeTraining(responseStudy);
      }
    }

    // Delete any tag related to the response, remove the relation between
    // response and study, and remove the response itself
    this.tagService.deleteResponse(response);
    this.responseStudyService.deleteResponse(response);
    this.responseService.delete(response);

    // Now remove the response from the bucket
    this.bucketStorage.objectDelete(response.videoURL);
  }
}
