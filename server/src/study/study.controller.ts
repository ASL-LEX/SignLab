import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { EntryService } from '../entry/entry.service';
import { Study } from '../study/study.schema';
import { StudyService } from '../study/study.service';
import { EntryStudyService } from '../entrystudy/entrystudy.service';
import { StudyCreation } from 'shared/dtos/study.dto';
import { UserStudy } from '../userstudy/userstudy.schema';
import { UserStudyService } from '../userstudy/userstudy.service';
import { UserService } from '../user/user.service';
import { Auth } from '../auth/auth.guard';
import { StudyPipe } from '../shared/pipes/study.pipe';
import { UserPipe } from '../shared/pipes/user.pipe';
import { User } from 'shared/dtos/user.dto';

@Controller('/api/study')
export class StudyController {
  constructor(
    private studyService: StudyService,
    private entryService: EntryService,
    private entryStudyService: EntryStudyService,
    private userStudyService: UserStudyService,
    private userService: UserService,
  ) {}
  /**
   * Get all of the studies
   */
  @Get('/:projectID')
  async getStudies(@Param('projectID') projectID: string): Promise<Study[]> {
    return this.studyService.getStudies(projectID);
  }

  /**
   * Deterine if a study with the given name exists
   */
  @Get('/exists')
  @Auth('admin')
  async studyExists(@Query('studyName') studyName: string, @Query('projectID') projectID: string): Promise<boolean> {
    return this.studyService.exists(studyName, projectID);
  }

  /**
   * Get information on a per-user basis on how users can access the
   * study.
   */
  @Get('/users')
  @Auth('admin')
  async getUserStudies(
    @Query('studyID', StudyPipe) study: Study,
  ): Promise<UserStudy[]> {
    return this.userStudyService.getUserStudies(study);
  }

  /**
   * Get information on a user for a specific study.
   *
   * TODO: Restrict acces to admin and the user in question
   */
  @Get('/user')
  async getUserStudy(
    @Query('studyID', StudyPipe) study: Study,
    @Query('userID', UserPipe) user: User,
  ): Promise<UserStudy> {
    return this.userStudyService.getUserStudy(user, study);
  }

  /**
   * Change if the given user will have tagging access on the given study.
   */
  @Put('/user/enable')
  @Auth('admin')
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
    const user = await this.userService.findOne({ _id: changeRequest.userID });
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
   * Make a a new study. When the new study is created, a EntryStudy will
   * be made for each Entry for this new study. This will return the
   * newly created study.
   */
  @Post('/create')
  @Auth('admin')
  async createStudy(@Body() studyCreation: StudyCreation): Promise<Study> {
    // Make sure the study name is unique
    const exists = await this.studyService.exists(studyCreation.study.name, studyCreation.projectID);
    if (exists) {
      throw new HttpException(
        `Study with name '${studyCreation.study.name}' already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newStudy = await this.studyService.createStudy({ ...studyCreation.study, project: studyCreation.projectID });

    // Now add a EntryStudy for each entry
    const entries = await this.entryService.getAllEntries();
    await this.entryStudyService.createEntryStudies(entries, newStudy, true);

    // Mark training and disabled entries
    await Promise.all([
      this.entryStudyService.markTraining(
        newStudy._id!,
        studyCreation.trainingEntries,
      ),
      this.entryStudyService.markDisabled(
        newStudy._id!,
        studyCreation.disabledEntries,
      ),
    ]);

    // Create user studies for all existing users
    const users = await this.userService.findAll({});
    await Promise.all(
      users.map((user) => {
        return this.userStudyService.create(user, newStudy);
      }),
    );

    return newStudy;
  }
}
