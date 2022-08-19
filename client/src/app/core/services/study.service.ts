import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Study, StudyCreation } from '../../../../../shared/dtos/study.dto';

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
}
