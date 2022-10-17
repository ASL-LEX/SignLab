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
import { EntryService } from '../../services/entry.service';
import { Study } from '../../schemas/study.schema';
import { StudyService } from '../../services/study.service';
import { EntryStudyService } from '../../services/entrystudy.service';
import { StudyCreation } from 'shared/dtos/study.dto';
import { UserStudy } from '../../schemas/userstudy.schema';
import { UserStudyService } from '../../services/userstudy.service';
import { UserService } from '../../services/user.service';
import { Auth } from '../../guards/auth.guard';

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
  @Get('/')
  async getStudies(): Promise<Study[]> {
    return this.studyService.getStudies();
  }

  /**
   * Deterine if a study with the given name exists
   */
  @Get('/exists')
  @Auth('admin')
  async studyExists(@Query('studyName') studyName: string): Promise<boolean> {
    return this.studyService.exists(studyName);
  }

  /**
   * Get information on a per-user basis on how users can access the
   * study.
   */
  @Get('/users')
  @Auth('admin')
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
   * Make a a new study. When the new study is created, a EntryStudy will
   * be made for each Entry for this new study. This will return the
   * newly created study.
   */
  @Post('/create')
  @Auth('admin')
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

    // Now add a EntryStudy for each entry
    const entries = await this.entryService.getAllEntries();
    await this.entryStudyService.createEntryStudies(entries, newStudy);

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
    const users = await this.userService.findAll();
    await Promise.all(
      users.map((user) => {
        return this.userStudyService.create(user, newStudy);
      }),
    );

    return newStudy;
  }
}
