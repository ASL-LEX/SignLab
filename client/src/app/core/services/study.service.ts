import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Study, StudyCreation } from '../../../../../shared/dtos/study.dto';
import { Tag } from '../../../../../shared/dtos/tag.dto';
import { User } from '../../../../../shared/dtos/user.dto';
import { UserStudy } from '../../../../../shared/dtos/userstudy.dto';

@Injectable({ providedIn: 'root' })
export class StudyService {
  constructor(private http: HttpClient) { }

  async saveStudy(studyCreation: StudyCreation): Promise<void> {
    await this.http.post<any>(`http://localhost:3000/api/study/create`, studyCreation, {}).toPromise();
  }

  async studyExists(studyName: string): Promise<boolean> {
    const query = { params: { studyName: studyName } };
    const result = await this.http.get<boolean>(`http://localhost:3000/api/study/exists`, query).toPromise();

    if(result === undefined) {
      return false;
    }
    return result;
  }

  async getUserStudies(studyID: string): Promise<UserStudy[]> {
    const query = { params: { studyID: studyID } };
    const result = await this.http.get<UserStudy[]>(`http://localhost:3000/api/study/users`, query).toPromise();

    if(result === undefined) {
      return [];
    }

    return result;
  }

  /**
   * Get the information on a given user in the context of a specific
   * study
   */
  async getUserStudy(user: User, study: Study): Promise<UserStudy> {
    const query = { params: { userID: user._id, studyID: study._id! } };
    const result = await this.http.get<UserStudy>(`http://localhost:3000/api/study/user`, query).toPromise();

    if(result === undefined) {
      throw new Error('No user study found for the given user and study');
    }
    return result;
  }

  /**
   * Get all studie === undefineds
   */
  async getStudies(): Promise<Study[]> {
    const result = await this.http.get<Study[]>(`http://localhost:3000/api/study`).toPromise();

    if(!result) {
      return [];
    }
    return result;
  }

  /**
   * Get all tags associated with the given study
   */
  async getTags(study: Study): Promise<Tag[]> {
    const query = { params: { studyID: study._id! } };

    const result = await this.http.get<Tag[]>(`http://localhost:3000/api/tag/forStudy`, query).toPromise();

    if(result === undefined) {
      return [];
    }

    return result;
  }

  /**
   * Get the training tags associated with the given user study
   */
  async getTrainingTags(userStudy: UserStudy): Promise<Tag[]> {
    const query = { params: { studyID: userStudy.study._id!, userID: userStudy.user._id } };

    const result = await this.http.get<Tag[]>(`http://localhost:3000/api/tag/training`, query).toPromise();

    if(result === undefined) {
      return [];
    }

    return result;
  }

  /**
   * Change if a user has accces to the study for tagging.
   *
   * On success returns true, otherwise returns false
   */
  async changeAccessToStudy(userStudy: UserStudy, hasAcccess: boolean): Promise<boolean> {
    const targetURL = `http://localhost:3000/api/study/user/enable`;
      const requestBody = { studyID: userStudy.study._id!, userID: userStudy.user._id, hasAccess: hasAcccess };

    try {
      await this.http.put<any>(targetURL, requestBody).toPromise();
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }
  }
}
