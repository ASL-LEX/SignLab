import { Injectable } from '@angular/core';
import { Study, StudyCreation } from '../../../../../shared/dtos/study.dto';
import { Tag } from '../../../../../shared/dtos/tag.dto';
import { User } from '../../../../../shared/dtos/user.dto';
import { UserStudy } from '../../../../../shared/dtos/userstudy.dto';
import { SignLabHttpClient } from './http.service';

@Injectable()
export class StudyService {
  constructor(private signLab: SignLabHttpClient) { }

  async saveStudy(studyCreation: StudyCreation): Promise<void> {
    return this.signLab.post<any>('api/study/create', studyCreation, {});
  }

  async studyExists(studyName: string): Promise<boolean> {
    const query = { params: { studyName: studyName } };
    return this.signLab.get<boolean>('api/study/exists', query);
  }

  async getUserStudies(studyID: string): Promise<UserStudy[]> {
    const query = { params: { studyID: studyID } };
    return this.signLab.get<UserStudy[]>('api/study/users', query);
  }

  /**
   * Get the information on a given user in the context of a specific
   * study
   */
  async getUserStudy(user: User, study: Study): Promise<UserStudy> {
    const query = { params: { userID: user._id, studyID: study._id! } };
    return this.signLab.get<UserStudy>('api/study/user', query);
  }

  /**
   * Get all studie === undefineds
   */
  async getStudies(): Promise<Study[]> {
    return this.signLab.get<Study[]>('api/study');
  }

  /**
   * Get all tags associated with the given study
   */
  async getTags(study: Study): Promise<Tag[]> {
    const query = { params: { studyID: study._id! } };
    return this.signLab.get<Tag[]>('api/tag/forStudy', query);
  }

  /**
   * Get the training tags associated with the given user study
   */
  async getTrainingTags(userStudy: UserStudy): Promise<Tag[]> {
    const query = { params: { studyID: userStudy.study._id!, userID: userStudy.user._id } };
    return this.signLab.get<Tag[]>('api/tag/training', query);
  }

  /**
   * Change if a user has accces to the study for tagging.
   *
   * On success returns true, otherwise returns false
   */
  async changeAccessToStudy(userStudy: UserStudy, hasAcccess: boolean): Promise<boolean> {
    const targetURL = 'api/study/user/enable';
    const requestBody = { studyID: userStudy.study._id!, userID: userStudy.user._id, hasAccess: hasAcccess };

    try {
      await this.signLab.put<any>(targetURL, requestBody);
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }
  }
}
