import * as Types from '../graphql';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Unnamed_1_QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = { __typename?: 'Query', getProjects: Array<{ __typename?: 'Project', _id: string, name: string, description: string, created: any }> };

export const Document = gql`
    {
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
  export class GQL extends Apollo.Query<Query, QueryVariables> {
    document = Document;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }