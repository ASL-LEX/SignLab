import {
  Controller,
  Get,
  Response,
  Param,
  StreamableFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { SchemaService } from './entry/schema.service';

@Controller()
export class AppController {
  constructor(private schemaService: SchemaService) {}

  @Get()
  clientUI(@Response() res: any) {
    return res.redirect('/index.html');
  }

  @Get('/media/:filename')
  videoURL(
    @Response({ passthrough: true }) res: any,
    @Param('filename') filename: string,
  ) {
    try {
      // Param is automatically URI decoded, for this testing, should not
      // take place here so the input is re-encoded. Since this route is used
      // only or local testing, this hack is ok
      filename = encodeURI(filename);
      const file = createReadStream(join(process.cwd(), `bucket/${filename}`));

      res.set({
        'Content-Type': 'video/webm',
      });
      return new StreamableFile(file);
    } catch (error: any) {
      console.error(error);

      throw new HttpException(
        `Failed to access the requested file ${filename}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Determine if the app is in the "First Time Setup Mode".
   *
   * For implementation, it is being leveraged that during a first time setup
   * there will not be any schema defined for the Entry metadata. Therefore
   * the existance of that schema is the indicitor of "First Time Setup Mode"
   */
  @Get('/api/first')
  async isFirstTime() {
    return {
      isFirstTimeSetup: !(await this.schemaService.hasSchema('Entry')),
    };
  }
}
