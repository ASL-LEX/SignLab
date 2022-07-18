import { Controller, Get, Response, Param, StreamableFile } from '@nestjs/common';
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
     const file = createReadStream(join(process.cwd(), `upload/responses/${filename}`));

     res.set({
       'Content-Type': 'video/webm'
     });
     return new StreamableFile(file);
  }
}
