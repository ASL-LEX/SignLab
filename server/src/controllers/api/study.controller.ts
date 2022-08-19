import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ResponseService } from '../../services/response.service';
import { Study } from '../../schemas/study.schema';
import { StudyService } from '../../services/study.service';
import { ResponseStudyService } from '../../services/responsestudy.service';
import { StudyCreation } from '../../../../shared/dtos/study.dto';

@Controller('/api/study')
export class StudyController {

  constructor(private studyService: StudyService,
              private responseService: ResponseService,
              private responseStudyService: ResponseStudyService) { }

  /**
   * Get all of the studies
   */
  @Get('/')
  async getStudies(): Promise<Study[]> {
    return this.studyService.getStudies();
  }

  /**
   * Deterine if a study with the given name exists
   */
  @Get('/exists')
  async studyExists(@Query('studyName') studyName: string): Promise<boolean> {
    return this.studyService.exists(studyName);
  }

  /**
   * Make a a new study. When the new study is created, a ResponseStudy will
   * be made for each Response for this new study.
   */
  @Post('/create')
  async createStudy(@Body() studyCreation: StudyCreation) {
    // Make sure the study name is unique
    const exists = await this.studyService.exists(studyCreation.study.name);
    if(exists) {
      throw new HttpException(`Study with name '${studyCreation.study.name}' already exists`, HttpStatus.BAD_REQUEST);
    }

    const newStudy = await this.studyService.createStudy(studyCreation.study);

    // Now add a ResponseStudy for each response
    const responses = await this.responseService.getAllResponses();
    await this.responseStudyService.createResponseStudies(responses, newStudy);

    // Mark training and disabled responses
    Promise.all([this.responseStudyService.markTraining(newStudy._id, studyCreation.trainingResponses),
                 this.responseStudyService.markDisabled(newStudy._id, studyCreation.disabledResponses)]);
  }
}
