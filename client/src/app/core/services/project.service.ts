import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Project, ProjectCreate } from '../../graphql/graphql';
import {
  GetProjectsGQL,
  GetProjectsQuery,
  GetProjectsQueryVariables,
  CreateProjectGQL,
  CreateProjectMutation,
  DeleteProjectGQL,
  DeleteProjectMutation
} from '../../graphql/projects/projects.generated';
import { MutationResult, QueryRef } from 'apollo-angular';

@Injectable()
export class ProjectService {
  /** The available projects */
  private projectsObs: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  /** The query to get the project list, used for refetching */
  private readonly projectQuery: QueryRef<GetProjectsQuery, GetProjectsQueryVariables>;
  /** The actively selected project */
  private activeProjectObs: BehaviorSubject<Project | null> = new BehaviorSubject<Project | null>(null);

  constructor(
    projectsGQL: GetProjectsGQL,
    private readonly createProjectGQL: CreateProjectGQL,
    private readonly deleteProjectGQL: DeleteProjectGQL
  ) {
    // Subscribe to the project query
    this.projectQuery = projectsGQL.watch({}, { errorPolicy: 'all' });
    this.projectQuery.valueChanges.subscribe((result) => {
      if (result.errors) {
        this.projectsObs.next([]);
        return;
      }
      this.projectsObs.next(result.data.getProjects);
    });
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

  public updateProjectList(): void {
    this.projectQuery.refetch().then((value) => {
      this.setActiveProject(value.data.getProjects[0] || null);
    });
  }

  public createProject(project: ProjectCreate): Observable<MutationResult<CreateProjectMutation>> {
    return this.createProjectGQL.mutate({ projectCreate: project });
  }

  public deleteProject(project: Project): Observable<MutationResult<DeleteProjectMutation>> {
    return this.deleteProjectGQL.mutate({ projectID: project._id });
  }
}
