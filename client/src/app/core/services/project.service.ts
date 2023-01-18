import { Injectable } from '@angular/core';
import { SignLabHttpClient } from './http.service';
import { ProjectCreate } from 'shared/dtos/project.dto';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { User } from 'shared/dtos/user.dto';
import { Project } from '../../../graphql/graphql';
import { ProjectsGQL } from '../../../graphql/projects/projects.generated';

@Injectable()
export class ProjectService {
  /** The available projects */
  projectsObs: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  /** The actively selected project */
  activeProjectObs: BehaviorSubject<Project | null> =
    new BehaviorSubject<Project | null>(null);

  constructor(private readonly signLab: SignLabHttpClient,
              private readonly projectsGQL: ProjectsGQL) {
    this.updateProjects();

    /*projectsGQL.watch().valueChanges.pipe(map(results => {
      console.log(results);
    })); */
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

  public hasActiveProject() {
    return this.activeProjectObs.value != null;
  }

  public async createProject(project: ProjectCreate): Promise<Project> {
    return await this.signLab.post('/api/projects', project, {
      provideToken: true,
    });
  }

  public async projectExists(name: string): Promise<boolean> {
    return this.signLab.get(`/api/projects/exists/${name}`, {
      provideToken: true,
    });
  }

  public async updateProjects(): Promise<void> {
    this.projectsObs.next(
      await this.signLab.get('/api/projects', { provideToken: true })
    );
  }

  public async changeAdminStatus(user: User, isAdmin: boolean) {
    const activeProject = this.activeProjectObs.getValue();
    if (!activeProject) {
      throw new Error(
        'Attempted to change project admin status without an active project'
      );
    }

    await this.signLab.put(
      '/api/projects/user/enable',
      {
        projectID: activeProject._id,
        userID: user._id,
        hasAdminAccess: isAdmin,
      },
      { provideToken: true }
    );
  }
}
