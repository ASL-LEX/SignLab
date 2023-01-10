import { Injectable } from '@angular/core';
import { SignLabHttpClient } from './http.service';
import { Project, ProjectCreate } from 'shared/dtos/project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly signLab: SignLabHttpClient) {}

  public async createProject(project: ProjectCreate): Promise<Project> {
    return await this.signLab.post('/api/projects', project, { withCredentials: true });
  }
}
