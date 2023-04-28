import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Project, ProjectCreate } from '../../graphql/graphql';
import {
  GetProjectsGQL,
  CreateProjectGQL,
  CreateProjectMutation,
  DeleteProjectGQL,
  DeleteProjectMutation,
  GetProjectsQuery,
  GetProjectsQueryVariables,
} from '../../graphql/projects/projects.generated';
import { MutationResult, QueryRef } from 'apollo-angular';
import { OrganizationService } from './organization.service';
import { ApolloQueryResult } from '@apollo/client';

@Injectable()
export class ProjectService {
  /** The available projects */
  private projectsObs: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  /** The actively selected project */
  private activeProjectObs: BehaviorSubject<Project | null> = new BehaviorSubject<Project | null>(null);
  /** Project query */
  private readonly projectQuery: QueryRef<GetProjectsQuery, GetProjectsQueryVariables>;

  constructor(
    projectsGQL: GetProjectsGQL,
    private readonly createProjectGQL: CreateProjectGQL,
    private readonly deleteProjectGQL: DeleteProjectGQL,
    orgService: OrganizationService
  ) {
    // Watch the get projects query and update the project observable on
    // changes
    this.projectQuery = projectsGQL.watch({}, { errorPolicy: 'all' });
    this.projectQuery.valueChanges.subscribe((result) => this.updateProjects(result));

    // When the organization changes, refetch the projects
    orgService.organization.subscribe(() => this.updateProjectList());
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

  public updateProjectList() {
    this.projectQuery.refetch();
  }

  private async updateProjects(projectResult: ApolloQueryResult<GetProjectsQuery>) {
    // Check for any errors, on errors just clear the project list
    if (projectResult.errors) {
      this.projectsObs.next([]);
      this.setActiveProject(null);
      return;
    }

    // Otherwise update the list of projects and set the active project to the
    // first project if it exists
    this.projectsObs.next(projectResult.data.getProjects);
    this.setActiveProject(projectResult.data.getProjects[0] || null);
  }
}
