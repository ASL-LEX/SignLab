import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Put,
} from '@nestjs/common';
import { ResponseService } from '../../services/response.service';
import { Study } from '../../schemas/study.schema';
import { StudyService } from '../../services/study.service';
import { ResponseStudyService } from '../../services/responsestudy.service';
import { StudyCreation } from '../../../../shared/dtos/study.dto';
import { UserStudy } from '../../schemas/userstudy.schema';
import { UserStudyService } from '../../services/userstudy.service';
import { UserService } from '../../services/user.service';
import { Roles } from '../../decorators/roles.decorator';

@Controller('/api/study')
export class StudyController {
  constructor(
    private studyService: StudyService,
    private responseService: ResponseService,
    private responseStudyService: ResponseStudyService,
    private userStudyService: UserStudyService,
    private userService: UserService,
  ) {}
  /**
   * Get all of the studies
   */
  @Get('/')
  @Roles('admin')
  async getStudies(): Promise<Study[]> {
    return this.studyService.getStudies();
  }

  /**
   * Deterine if a study with the given name exists
   */
  @Get('/exists')
  @Roles('admin')
  async studyExists(@Query('studyName') studyName: string): Promise<boolean> {
    return this.studyService.exists(studyName);
  }

  /**
   * Get information on a per-user basis on how users can access the
   * study.
   */
  @Get('/users')
  @Roles('admin')
  async getUserStudies(
    @Query('studyID') studyID: string,
  ): Promise<UserStudy[]> {
    const study = await this.studyService.find(studyID);
    if (!study) {
      return [];
    }

    return this.userStudyService.getUserStudies(study);
  }

  /**
   * Get information on a user for a specific study.
   *
   * TODO: Restrict acces to admin and the user in question
   */
  @Get('/user')
  async getUserStudy(
    @Query('studyID') studyID: string,
    @Query('userID') userID: string,
  ): Promise<UserStudy> {
    const study = await this.studyService.find(studyID);
    if (!study) {
      throw new HttpException(
        `The study with id ${studyID} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.find(userID);
    if (!user) {
      throw new HttpException(
        `The user with id ${userID} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userStudyService.getUserStudy(user, study);
  }

  /**
   * Change if the given user will have tagging access on the given study.
   */
  @Put('/user/enable')
  @Roles('admin')
  async changeUserAccess(
    @Body()
    changeRequest: {
      studyID: string;
      userID: string;
      hasAccess: boolean;
    },
  ): Promise<void> {
    const study = await this.studyService.find(changeRequest.studyID);
    if (!study) {
      throw new HttpException(
        `The study with id ${changeRequest.studyID} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.find(changeRequest.userID);
    if (!user) {
      throw new HttpException(
        `The user with id ${changeRequest.userID} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.userStudyService.changeUserAccess(
      study,
      user,
      changeRequest.hasAccess,
    );
  }

  /**
   * Make a a new study. When the new study is created, a ResponseStudy will
   * be made for each Response for this new study. This will return the
   * newly created study.
   */
  @Post('/create')
  @Roles('admin')
  async createStudy(@Body() studyCreation: StudyCreation): Promise<Study> {
    // Make sure the study name is unique
    const exists = await this.studyService.exists(studyCreation.study.name);
    if (exists) {
      throw new HttpException(
        `Study with name '${studyCreation.study.name}' already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newStudy = await this.studyService.createStudy(studyCreation.study);

    // Now add a ResponseStudy for each response
    const responses = await this.responseService.getAllResponses();
    await this.responseStudyService.createResponseStudies(responses, newStudy);

    // Mark training and disabled responses
    await Promise.all([
      this.responseStudyService.markTraining(
        newStudy._id,
        studyCreation.trainingResponses,
      ),
      this.responseStudyService.markDisabled(
        newStudy._id,
        studyCreation.disabledResponses,
      ),
    ]);

    // Create user studies for all existing users
    const users = await this.userService.findAll();
    await Promise.all(
      users.map((user) => {
        return this.userStudyService.create(user, newStudy);
      }),
    );

    return newStudy;
  }
}
