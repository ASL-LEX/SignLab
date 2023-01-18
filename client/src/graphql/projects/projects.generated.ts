import * as Types from '../graphql';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ProjectsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ProjectsQuery = { __typename?: 'Query', getProjects: Array<{ __typename?: 'Project', _id: string, name: string, description: string, created: any }> };

export const ProjectsDocument = gql`
    query Projects {
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
  export class ProjectsGQL extends Apollo.Query<ProjectsQuery, ProjectsQueryVariables> {
    document = ProjectsDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
