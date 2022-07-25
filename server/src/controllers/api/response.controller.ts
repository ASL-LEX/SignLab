import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Query,
  HttpException,
  HttpStatus,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Roles } from 'src/decorators/roles.decorator';
import { ResponseService } from '../../services/response.service';
import { Readable } from 'stream';
import { diskStorage } from 'multer';
import { Response } from '../../schemas/response.schema';
import { SaveAttempt } from '../../../../shared/dtos/response.dto';
import { Tag } from '../../schemas/tag.schema';
import { UserService } from '../../services/user.service';
import { StudyService } from '../../services/study.service';

@Controller('/api/response')
export class ResponseController {
  constructor(private responseService: ResponseService,
              private userService: UserService,
              private studyService: StudyService) {}

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
  @UseInterceptors(FileInterceptor('file'))
  // @Roles('admin')
  async uploadCSV(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SaveAttempt> {
    // TODO: Add error handling on file type
    // Make a stream from the buffer in the file
    const fileStream = Readable.from(file.buffer);
    return await this.responseService.uploadResponseDataCSV(fileStream);
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
  // @Roles('admin')
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
    return await this.responseService.uploadResponseVideos(
      './upload/upload.zip',
    );
  }

  /**
   * Get all response information
   */
  @Get('/')
  async getResponses(): Promise<Response[]> {
    return await this.responseService.getAllResponses();
  }

  /**
   * Assign a response to a user for tagging. The user will be assigned a
   * response to tag for a specific study. Once that user is assigned that
   * response, no other users will be able to tag that response for the given
   * study.
   *
   * If the user already has a response assigned for the study that they have
   * yet to complete, this will return that incomplete tag.
   */
  @Get('/assign')
  // @Roles('tagging')
  async getAssignedResponse(@Query('userID') userID: string, @Query('studyID') studyID: string): Promise<Tag | null> {
    // Try to find user from database
    const user = await this.userService.find(userID);
    if (!user) {
      // User not found
      throw new HttpException(`User with ID '${userID}' not found`, HttpStatus.BAD_REQUEST);
    }

    // Try to find the study from the database
    const study = await this.studyService.find(studyID);
    if (!study) {
      // Study not found
      throw new HttpException(`Study with ID '${studyID}' not found`, HttpStatus.BAD_REQUEST);
    }

    // Otherwise return the result of trying to assign the user a response to
    // tag
    return this.responseService.assignResponse(user, study);
  }

  /**
   * Save the provided tag for the given response.
   */
  @Post('/tag')
  async tagResponse(@Body() tag: Tag) {
    try {
      await this.responseService.addTag(tag);
    } catch(error) {
      throw new HttpException('Tag failed validation', HttpStatus.BAD_REQUEST);
    }
  }
}
