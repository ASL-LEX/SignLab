/* eslint-disable */
import * as Types from '../graphql';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type GetProjectsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = { __typename?: 'Query', getProjects: Array<{ __typename?: 'Project', _id: string, name: string, description: string, created: any }> };

export type CreateProjectMutationVariables = Types.Exact<{
  projectCreate: Types.ProjectCreate;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', _id: string, name: string, description: string, created: any } };

export type ProjectExistsQueryVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type ProjectExistsQuery = { __typename?: 'Query', projectExists: boolean };

export type ProjectAdminChangeMutationVariables = Types.Exact<{
  projectAdminChange: Types.ProjectAdminChange;
}>;


export type ProjectAdminChangeMutation = { __typename?: 'Mutation', projectAdminChange: boolean };

export type DeleteProjectMutationVariables = Types.Exact<{
  projectID: Types.Scalars['ID'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject: boolean };

export const GetProjectsDocument = gql`
    query getProjects {
  getProjects {
    _id
    name
    description
    created
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetProjectsGQL extends Apollo.Query<GetProjectsQuery, GetProjectsQueryVariables> {
    document = GetProjectsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateProjectDocument = gql`
    mutation createProject($projectCreate: ProjectCreate!) {
  createProject(projectCreate: $projectCreate) {
    _id
    name
    description
    created
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateProjectGQL extends Apollo.Mutation<CreateProjectMutation, CreateProjectMutationVariables> {
    document = CreateProjectDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ProjectExistsDocument = gql`
    query projectExists($name: String!) {
  projectExists(name: $name)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ProjectExistsGQL extends Apollo.Query<ProjectExistsQuery, ProjectExistsQueryVariables> {
    document = ProjectExistsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ProjectAdminChangeDocument = gql`
    mutation projectAdminChange($projectAdminChange: ProjectAdminChange!) {
  projectAdminChange(projectAdminChange: $projectAdminChange)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ProjectAdminChangeGQL extends Apollo.Mutation<ProjectAdminChangeMutation, ProjectAdminChangeMutationVariables> {
    document = ProjectAdminChangeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteProjectDocument = gql`
    mutation deleteProject($projectID: ID!) {
  deleteProject(projectID: $projectID)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteProjectGQL extends Apollo.Mutation<DeleteProjectMutation, DeleteProjectMutationVariables> {
    document = DeleteProjectDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }