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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../decorators/roles.decorator';
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

@Controller('/api/response')
export class ResponseController {
  constructor(
    private responseService: ResponseService,
    private schemaService: SchemaService,
    private responseUploadService: ResponseUploadService,
    private studyService: StudyService,
    private responseStudyService: ResponseStudyService,
  ) {}

  /**
   * Handle storing the metadata schema which will be stored for
   * every response.
   *
   * NOTE: This is a one-time operation. Once the meta data is specified,
   *       it cannot be changed.
   */
  @Post('/metadata')
  @Roles('owner')
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
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  // @Roles('admin')
  async uploadCSV(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SaveAttempt> {
    // TODO: Add error handling on file type
    // Make a stream from the buffer in the file
    const fileStream = Readable.from(file.buffer);
    return this.responseUploadService.uploadResponseDataCSV(fileStream);
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
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      // @Roles('admin')
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
  @Roles('admin')
  async getResponses(): Promise<Response[]> {
    return this.responseService.getAllResponses();
  }

  /*
   * Get the response studies for a specific study.
   */
  @Get('/responsestudies')
  @Roles('admin')
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
  @Roles('admin')
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
}
