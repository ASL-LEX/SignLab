import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from 'shared/dtos/project.dto';
import { Study, StudyCreation } from 'shared/dtos/study.dto';
import { Tag } from 'shared/dtos/tag.dto';
import { User } from 'shared/dtos/user.dto';
import { UserStudy } from 'shared/dtos/userstudy.dto';
import { SignLabHttpClient } from './http.service';
import { ProjectService } from './project.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StudyService {
  /**
   * Keeps track of the currently active study the user selected. This allows
   * for the active study to be accessed from any component.
   */
  private activeStudyObservable: BehaviorSubject<Study | null> =
    new BehaviorSubject<Study | null>(null);
  /**
   * Keep track of possible studies
   */
  private studiesObservable: BehaviorSubject<Study[]> = new BehaviorSubject<
    Study[]
  >([]);
  private currentStudies: Study[] = [];

  constructor(
    private signLab: SignLabHttpClient,
    private projectService: ProjectService
  ) {
    this.projectService.activeProject.subscribe(
      async (_project: Project | null) => {
        this.updateStudies();
      }
    );
  }

  /** Set the currently selected study */
  setActiveStudy(study: Study | null | string) {
    /** If the type is a string, then look up based on ID */
    if (typeof study === 'string') {
      const foundStudy = this.currentStudies.find((s) => s._id === study);
      if (!foundStudy) {
        throw new Error('Study not found');
      }
      study = foundStudy;
    }
    this.activeStudyObservable.next(study);
  }

  get activeStudy(): Observable<Study | null> {
    return this.activeStudyObservable;
  }

  get studies(): Observable<Study[]> {
    return this.studiesObservable;
  }

  /**
   * Update the observable list of studies based on the active project
   */
  async updateStudies() {
    const project = await firstValueFrom(this.projectService.activeProject);
    if (project === null) {
      this.activeStudyObservable.next(null);
      this.studiesObservable.next([]);
      return;
    }

    this.activeStudyObservable.next(null);
    this.currentStudies = await this.getStudies(project);
    this.studiesObservable.next(this.currentStudies);
  }

  hasActiveStudy(): boolean {
    return !!this.activeStudyObservable.value;
  }

  async saveStudy(studyCreation: StudyCreation): Promise<void> {
    return this.signLab.post<any>('api/study/create', studyCreation, {
      provideToken: true,
    });
  }

  async studyExists(studyName: string): Promise<boolean> {
    const project = await firstValueFrom(this.projectService.activeProject);
    if (project === null) {
      throw new Error('No active project');
    }

    const query = {
      params: { studyName: studyName, projectID: project._id! },
      provideToken: true,
    };
    return this.signLab.get<boolean>('api/study/exists', query);
  }

  async getUserStudies(studyID: string): Promise<UserStudy[]> {
    const query = { params: { studyID: studyID }, provideToken: true };
    return this.signLab.get<UserStudy[]>('api/study/users', query);
  }

  /**
   * Get the information on a given user in the context of a specific
   * study
   */
  async getUserStudy(user: User, study: Study): Promise<UserStudy> {
    const query = {
      params: { userID: user._id, studyID: study._id! },
      provideToken: true,
    };
    return this.signLab.get<UserStudy>('api/study/user', query);
  }

  /**
   * Get all studies for a given project
   */
  async getStudies(project: Project): Promise<Study[]> {
    const query = { params: { projectID: project._id! }, provideToken: true };
    return this.signLab.get<Study[]>('api/study', query);
  }

  /**
   * Get all studies for the currently active project
   */
  async getStudiesForActiveProject(): Promise<Study[]> {
    const project = await firstValueFrom(this.projectService.activeProject);
    if (project === null) {
      console.error('No active project, cannot get list of studies');
      throw new Error('No active project');
    }
    return this.getStudies(project);
  }

  async hasStudies(): Promise<boolean> {
    const project = await firstValueFrom(this.projectService.activeProject);
    if (project === null) {
      return false;
    }

    const studies = await this.getStudies(project);
    return studies.length > 0;
  }

  /**
   * Get all tags associated with the given study
   */
  async getTags(study: Study): Promise<Tag[]> {
    const query = { params: { studyID: study._id! }, provideToken: true };
    return this.signLab.get<Tag[]>('api/tag/forStudy', query);
  }

  /**
   * Get the training tags associated with the given user study
   */
  async getTrainingTags(userStudy: UserStudy): Promise<Tag[]> {
    const query = {
      params: { studyID: userStudy.study._id!, userID: userStudy.user._id },
      provideToken: true,
    };
    return this.signLab.get<Tag[]>('api/tag/training', query);
  }

  async changeAdminStatus(user: User, adminStatus: boolean): Promise<void> {
    await this.signLab.put('api/study/admin/enable', {
      userID: user._id,
      studyID: this.activeStudyObservable.value!._id!,
      hasAdminAccess: adminStatus,
    }, { provideToken: true });
  }

  /**
   * Change if a user has accces to the study for tagging.
   *
   * On success returns true, otherwise returns false
   */
  async changeAccessToStudy(
    userStudy: UserStudy,
    hasAcccess: boolean
  ): Promise<boolean> {
    const targetURL = 'api/study/user/enable';
    const requestBody = {
      studyID: userStudy.study._id!,
      userID: userStudy.user._id,
      hasAccess: hasAcccess,
    };

    try {
      await this.signLab.put<any>(targetURL, requestBody, {
        provideToken: true,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
