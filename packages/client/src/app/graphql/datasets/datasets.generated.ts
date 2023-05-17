/* eslint-disable */
import * as Types from '../graphql';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type GetDatasetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetDatasetsQuery = { __typename?: 'Query', getDatasets: Array<{ __typename?: 'Dataset', id: string, name: string, description: string, projectAccess: any, creator: { __typename?: 'User', _id: string, name: string, email: string, username: string, roles: any, organization: { __typename?: 'Organization', _id: string, name: string } } }> };

export type GetDatasetsByProjectQueryVariables = Types.Exact<{
  project: Types.Scalars['ID'];
}>;


export type GetDatasetsByProjectQuery = { __typename?: 'Query', getDatasetsByProject: Array<{ __typename?: 'Dataset', id: string, name: string, description: string, projectAccess: any, creator: { __typename?: 'User', _id: string, name: string, email: string, username: string, roles: any, organization: { __typename?: 'Organization', _id: string, name: string } } }> };

export type DatasetExistsQueryVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type DatasetExistsQuery = { __typename?: 'Query', datasetExists: boolean };

export type CreateDatasetMutationVariables = Types.Exact<{
  datasetCreate: Types.DatasetCreate;
}>;


export type CreateDatasetMutation = { __typename?: 'Mutation', createDataset: { __typename?: 'Dataset', id: string, name: string, description: string, creator: { __typename?: 'User', _id: string, name: string, email: string, username: string, roles: any, organization: { __typename?: 'Organization', _id: string, name: string } } } };

export type ChangeProjectAccessMutationVariables = Types.Exact<{
  projectAccessChange: Types.ProjectAccessChange;
}>;


export type ChangeProjectAccessMutation = { __typename?: 'Mutation', changeProjectAccess: boolean };

export type ChangeDatasetNameMutationVariables = Types.Exact<{
  dataset: Types.Scalars['ID'];
  newName: Types.Scalars['String'];
}>;


export type ChangeDatasetNameMutation = { __typename?: 'Mutation', changeDatasetName: boolean };

export type ChangeDatasetDescriptionMutationVariables = Types.Exact<{
  dataset: Types.Scalars['ID'];
  newDescription: Types.Scalars['String'];
}>;


export type ChangeDatasetDescriptionMutation = { __typename?: 'Mutation', changeDatasetDescription: boolean };

export const GetDatasetsDocument = gql`
    query getDatasets {
  getDatasets {
    id
    name
    description
    creator {
      _id
      name
      email
      username
      roles
      organization {
        _id
        name
      }
    }
    projectAccess
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDatasetsGQL extends Apollo.Query<GetDatasetsQuery, GetDatasetsQueryVariables> {
    document = GetDatasetsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDatasetsByProjectDocument = gql`
    query getDatasetsByProject($project: ID!) {
  getDatasetsByProject(project: $project) {
    id
    name
    description
    creator {
      _id
      name
      email
      username
      roles
      organization {
        _id
        name
      }
    }
    projectAccess
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDatasetsByProjectGQL extends Apollo.Query<GetDatasetsByProjectQuery, GetDatasetsByProjectQueryVariables> {
    document = GetDatasetsByProjectDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetExistsDocument = gql`
    query datasetExists($name: String!) {
  datasetExists(name: $name)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetExistsGQL extends Apollo.Query<DatasetExistsQuery, DatasetExistsQueryVariables> {
    document = DatasetExistsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateDatasetDocument = gql`
    mutation createDataset($datasetCreate: DatasetCreate!) {
  createDataset(datasetCreate: $datasetCreate) {
    id
    name
    description
    creator {
      _id
      name
      email
      username
      roles
      organization {
        _id
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateDatasetGQL extends Apollo.Mutation<CreateDatasetMutation, CreateDatasetMutationVariables> {
    document = CreateDatasetDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangeProjectAccessDocument = gql`
    mutation changeProjectAccess($projectAccessChange: ProjectAccessChange!) {
  changeProjectAccess(projectAccessChange: $projectAccessChange)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangeProjectAccessGQL extends Apollo.Mutation<ChangeProjectAccessMutation, ChangeProjectAccessMutationVariables> {
    document = ChangeProjectAccessDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangeDatasetNameDocument = gql`
    mutation changeDatasetName($dataset: ID!, $newName: String!) {
  changeDatasetName(dataset: $dataset, newName: $newName)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangeDatasetNameGQL extends Apollo.Mutation<ChangeDatasetNameMutation, ChangeDatasetNameMutationVariables> {
    document = ChangeDatasetNameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangeDatasetDescriptionDocument = gql`
    mutation changeDatasetDescription($dataset: ID!, $newDescription: String!) {
  changeDatasetDescription(dataset: $dataset, newDescription: $newDescription)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangeDatasetDescriptionGQL extends Apollo.Mutation<ChangeDatasetDescriptionMutation, ChangeDatasetDescriptionMutationVariables> {
    document = ChangeDatasetDescriptionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }