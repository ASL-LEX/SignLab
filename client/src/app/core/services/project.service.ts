import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Project, ProjectCreate } from '../../graphql/graphql';
import {
  GetProjectsGQL,
  CreateProjectGQL,
  CreateProjectMutation,
  DeleteProjectGQL,
  DeleteProjectMutation
} from '../../graphql/projects/projects.generated';
import { MutationResult } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProjectService {
  /** The available projects */
  private projectsObs: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  /** The actively selected project */
  private activeProjectObs: BehaviorSubject<Project | null> = new BehaviorSubject<Project | null>(null);

  constructor(
    private readonly projectsGQL: GetProjectsGQL,
    private readonly createProjectGQL: CreateProjectGQL,
    private readonly deleteProjectGQL: DeleteProjectGQL
  ) {
    this.updateProjectList();
  }

  get projects(): Observable<Project[]> {
    return this.projectsObs;
  }

  setActiveProject(project: Project | null | string) {
    if (typeof project === 'string') {
      const foundProject = this.projectsObs.getValue().find((s) => s._id === project);
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

  public createProject(project: ProjectCreate): Observable<MutationResult<CreateProjectMutation>> {
    return this.createProjectGQL.mutate({ projectCreate: project });
  }

  public deleteProject(project: Project): Observable<MutationResult<DeleteProjectMutation>> {
    return this.deleteProjectGQL.mutate({ projectID: project._id });
  }

  public async updateProjectList() {
    const projects = await firstValueFrom(this.projectsGQL.fetch());
    if (projects.errors) {
      this.projectsObs.next([]);
      return;
    }
    this.projectsObs.next(projects.data.getProjects);
    this.setActiveProject(projects.data.getProjects[0] || null);
  }
}
