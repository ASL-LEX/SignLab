import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Roles } from 'src/decorators/roles.decorator';
import { ResponseService } from '../../services/response.service';
import { Readable } from 'stream';
import { diskStorage } from 'multer';
import { Response } from '../../schemas/response.schema';
import { SaveAttempt } from '../../../../shared/dtos/response.dto';

@Controller('/api/response')
export class ResponseController {
  constructor(private responseService: ResponseService) {}

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
}
