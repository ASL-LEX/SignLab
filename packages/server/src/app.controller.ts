import { Controller, Get, Response, Param, StreamableFile, HttpException, HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  clientUI(@Response() res: any) {
    return res.redirect('/index.html');
  }

  @Get('/media/:filename')
  videoURL(@Response({ passthrough: true }) res: any, @Param('filename') filename: string) {
    try {
      // Param is automatically URI decoded, for this testing, should not
      // take place here so the input is re-encoded. Since this route is used
      // only or local testing, this hack is ok
      filename = encodeURI(filename);
      const file = createReadStream(join(process.cwd(), `bucket/${filename}`));

      res.set({
        'Content-Type': 'video/webm'
      });
      return new StreamableFile(file);
    } catch (error: any) {
      console.error(error);

      throw new HttpException(`Failed to access the requested file ${filename}`, HttpStatus.BAD_REQUEST);
    }
  }
}
