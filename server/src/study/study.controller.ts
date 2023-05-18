import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Put,
  UseGuards,
  Delete,
  Param,
  BadRequestException
} from '@nestjs/common';
import { EntryService } from '../entry/entry.service';
import { Study } from '../study/study.schema';
import { StudyService } from '../study/study.service';
import { EntryStudyService } from '../entrystudy/entrystudy.service';
import { StudyCreation } from 'shared/dtos/study.dto';
import { UserStudy } from '../userstudy/userstudy.schema';
import { UserStudyService } from '../userstudy/userstudy.service';
import { UserService } from '../user/user.service';
import { StudyPipe } from '../shared/pipes/study.pipe';
import { UserPipe } from '../shared/pipes/user.pipe';
import { User } from '../user/user.schema';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { StudyGuard } from '../auth/study.guard';
import { ProjectGuard } from '../auth/project.guard';
import { UserContext } from '../user/user.decorator';
import { Organization } from '../organization/organization.schema';
import { OrganizationContext } from '../organization/organization.decorator';
import { DatasetService } from '../dataset/dataset.service';
import { Entry } from '../entry/entry.schema';
import {EntryStudy} from 'src/entrystudy/entrystudy.schema';

@Controller('/api/study')
export class StudyController {
  constructor(
    private studyService: StudyService,
    private entryService: EntryService,
    private entryStudyService: EntryStudyService,
    private userStudyService: UserStudyService,
    private userService: UserService,
    private datasetService: DatasetService
  ) {}
  /**
   * Get all of the studies
   */
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getStudies(@Query('projectID') projectID: string, @UserContext() user: User): Promise<Study[]> {
    return this.studyService.findByUser(user, projectID);
  }

  /**
   * Deterine if a study with the given name exists
   */
  @Get('/exists')
  async studyExists(@Query('studyName') studyName: string, @Query('projectID') projectID: string): Promise<boolean> {
    return this.studyService.exists(studyName, projectID);
  }

  /**
   * Get information on a per-user basis on how users can access the
   * study.
   * TODO: Add guard for getters
   */
  @Get('/users')
  @UseGuards(JwtAuthGuard)
  async getUserStudies(@Query('studyID', StudyPipe) study: Study): Promise<UserStudy[]> {
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
    @Query('userID', UserPipe) user: User
  ): Promise<UserStudy> {
    return this.userStudyService.getUserStudy(user, study);
  }

  /**
   * Change if the user is an admin for the study
   */
  @Put('/admin/enable')
  @UseGuards(JwtAuthGuard, StudyGuard)
  async controlAdminAccess(
    @Body()
    changeRequest: {
      studyID: string;
      userID: string;
      hasAdminAccess: boolean;
    }
  ): Promise<void> {
    const study = await this.studyService.find(changeRequest.studyID);
    if (!study) {
      throw new HttpException('Study not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne({ _id: changeRequest.userID });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return this.userService.markAsStudyAdmin(user, study, changeRequest.hasAdminAccess);
  }

  /** Change if the user can view the given study */
  @Put('/visibility/enable')
  @UseGuards(JwtAuthGuard, StudyGuard)
  async controlVisibility(
    @Body() changeRequest: { studyID: string; userID: string; isVisible: boolean }
  ): Promise<void> {
    const study = await this.studyService.find(changeRequest.studyID);
    if (!study) {
      throw new HttpException(`The study with id ${changeRequest.studyID} does not exist`, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: changeRequest.userID });
    if (!user) {
      throw new HttpException(`The user with id ${changeRequest.userID} does not exist`, HttpStatus.BAD_REQUEST);
    }

    this.userService.markAsVisible(user, study, changeRequest.isVisible);
  }

  /** Change if a user can contribute to the study */
  @Put('/contributor/enable')
  @UseGuards(JwtAuthGuard, StudyGuard)
  async controlContributeAccess(
    @Body()
    changeRequest: {
      studyID: string;
      userID: string;
      hasAccess: boolean;
    }
  ): Promise<void> {
    const study = await this.studyService.find(changeRequest.studyID);
    if (!study) {
      throw new HttpException(`The study with id ${changeRequest.studyID} does not exist`, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: changeRequest.userID });
    if (!user) {
      throw new HttpException(`The user with id ${changeRequest.userID} does not exist`, HttpStatus.BAD_REQUEST);
    }

    this.userService.markAsContributor(user, study, changeRequest.hasAccess);
  }

  /**
   * Make a a new study. When the new study is created, a EntryStudy will
   * be made for each Entry for this new study. This will return the
   * newly created study.
   */
  @Post('/create')
  @UseGuards(JwtAuthGuard, ProjectGuard)
  async createStudy(
    @Body() studyCreation: StudyCreation,
    @UserContext() user: User,
    @OrganizationContext() organization: Organization
  ): Promise<Study> {
    // Make sure the study name is unique
    const exists = await this.studyService.exists(studyCreation.study.name, studyCreation.projectID);
    if (exists) {
      throw new HttpException(`Study with name '${studyCreation.study.name}' already exists`, HttpStatus.BAD_REQUEST);
    }

    const newStudy = await this.studyService.createStudy({
      ...studyCreation.study,
      organization: organization._id,
      project: studyCreation.projectID
    });

    // Get all datasets
    const datasets = await this.datasetService.findAll(organization._id);

    // Make the entry studies for every entry
    await Promise.all(datasets.map(async (dataset) => {
      // Get the entries associated with this dataset
      const entries = await this.entryService.getEntriesForDataset(dataset);

      // The entry is part of the study by default if the dataset the entry is
      // a part of is accessible to the project the study is a part of
      const isPartOfStudy = (dataset.projectAccess as any).get(studyCreation.projectID) || false;

      await this.entryStudyService.createEntryStudies(entries, newStudy, isPartOfStudy);
    }));

    // Mark training and disabled entries
    await Promise.all([
      this.entryStudyService.markTraining(newStudy._id!, studyCreation.trainingEntries),
      this.entryStudyService.markDisabled(newStudy._id!, studyCreation.disabledEntries)
    ]);

    // Create user studies for all existing users
    const users = await this.userService.findAll({ organization: user.organization });
    await Promise.all(
      users.map((user) => {
        return this.userStudyService.create(user, newStudy);
      })
    );

    return newStudy;
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, ProjectGuard)
  async deleteStudy(@Param('id', StudyPipe) study: Study): Promise<void> {
    await this.studyService.delete(study);
  }

  @Put('/name')
  @UseGuards(JwtAuthGuard, ProjectGuard)
  async changeName(@Body() nameChange: { study: string; newName: string }): Promise<void> {
    // Get the study and ensure it exists
    const study = await this.studyService.find(nameChange.study);
    if (study === null) {
      throw new BadRequestException(`Study with ID ${nameChange.study} does not exist`);
    }

    // Check to make sure the study name is unique
    if (await this.studyService.exists(nameChange.newName, study.project as string)) {
      throw new BadRequestException(`Study already exists with the name ${nameChange.newName}`);
    }

    // Change the name
    await this.studyService.changeName(study, nameChange.newName);
  }

  @Put('/description')
  @UseGuards(JwtAuthGuard, ProjectGuard)
  async changeDescription(@Body() nameChange: { study: string; newDescription: string }): Promise<void> {
    // Get the study and ensure it exists
    const study = await this.studyService.find(nameChange.study);
    if (study === null) {
      throw new BadRequestException(`Study with ID ${nameChange.study} does not exist`);
    }

    // Change the name
    await this.studyService.changeDescription(study, nameChange.newDescription);
  }
}
