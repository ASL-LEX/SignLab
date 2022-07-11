import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('/api/prompt')
export class PromptController {
  @Post('/upload/csv')
  @UseInterceptors(FileInterceptor('file'))
  @Roles('admin')
  uploadCSV(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    // TODO: Handle CSV parsing
  }
}
