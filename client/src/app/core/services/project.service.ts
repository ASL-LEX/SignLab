import { Injectable } from '@angular/core';
import { SignLabHttpClient } from './http.service';
import { Project, ProjectCreate } from 'shared/dtos/project.dto';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class ProjectService {
  /** The available projects */
  projectsObs: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  /** The actively selected project */
  activeProjectObs: BehaviorSubject<Project | null> =
    new BehaviorSubject<Project | null>(null);

  constructor(private readonly signLab: SignLabHttpClient) {
    this.updateProjects();
  }

  get projects(): Observable<Project[]> {
    return this.projectsObs;
  }

  setActiveProject(project: Project | null | string) {
    if (typeof project === 'string') {
      const foundProject = this.projectsObs
        .getValue()
        .find((s) => s._id === project);
      if (!foundProject) {
        throw new Error('Project not found');
      }
      project = foundProject;
    }

    this.activeProjectObs.next(project);
  }

  get activeProject(): Observable<Project | null> {
    return this.activeProjectObs;
  }

  public async createProject(project: ProjectCreate): Promise<Project> {
    return await this.signLab.post('/api/projects', project, {
      withCredentials: true,
    });
  }

  public async projectExists(name: string): Promise<boolean> {
    return this.signLab.get(`/api/projects/exists/${name}`, {
      withCredentials: true,
    });
  }

  public async updateProjects(): Promise<void> {
    this.projectsObs.next(
      await this.signLab.get('/api/projects', { withCredentials: true })
    );
  }
}
