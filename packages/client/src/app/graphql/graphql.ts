/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String'];
  user: User;
};

export type Dataset = {
  __typename?: 'Dataset';
  /** The user who created the dataset */
  creator: User;
  /** Human readable discription to describe the purpose of the dataset */
  description: Scalars['String'];
  id: Scalars['ID'];
  /** Human readable way to idenfity the dataset, unique */
  name: Scalars['String'];
  projectAccess: Scalars['JSON'];
};

export type DatasetCreate = {
  /** The ID of the user who is creating the dataset */
  creatorID: Scalars['ID'];
  /** Human readable discription to describe the purpose of the dataset */
  description: Scalars['String'];
  /** Human readable way to idenfity the dataset, unique */
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeDatasetDescription: Scalars['Boolean'];
  changeDatasetName: Scalars['Boolean'];
  changeProjectAccess: Scalars['Boolean'];
  createDataset: Dataset;
  createOrganization: Organization;
  createProject: Project;
  deleteProject: Scalars['Boolean'];
  login: AuthResponse;
  projectAdminChange: Scalars['Boolean'];
  signup: AuthResponse;
};


export type MutationChangeDatasetDescriptionArgs = {
  dataset: Scalars['ID'];
  newDescription: Scalars['String'];
};


export type MutationChangeDatasetNameArgs = {
  dataset: Scalars['ID'];
  newName: Scalars['String'];
};


export type MutationChangeProjectAccessArgs = {
  projectAccessChange: ProjectAccessChange;
};


export type MutationCreateDatasetArgs = {
  datasetCreate: DatasetCreate;
};


export type MutationCreateOrganizationArgs = {
  orgCreate: OrganizationCreate;
};


export type MutationCreateProjectArgs = {
  projectCreate: ProjectCreate;
};


export type MutationDeleteProjectArgs = {
  projectID: Scalars['ID'];
};


export type MutationLoginArgs = {
  credentials: UserCredentials;
};


export type MutationProjectAdminChangeArgs = {
  projectAdminChange: ProjectAdminChange;
};


export type MutationSignupArgs = {
  credentials: UserSignup;
};

export type Organization = {
  __typename?: 'Organization';
  _id: Scalars['ID'];
  name: Scalars['String'];
};

export type OrganizationCreate = {
  name: Scalars['String'];
};

export type PasswordComplexity = {
  __typename?: 'PasswordComplexity';
  lowerCase?: Maybe<Scalars['Float']>;
  max?: Maybe<Scalars['Float']>;
  min?: Maybe<Scalars['Float']>;
  numeric?: Maybe<Scalars['Float']>;
  requirementCount?: Maybe<Scalars['Float']>;
  symbol?: Maybe<Scalars['Float']>;
  upperCase?: Maybe<Scalars['Float']>;
};

/** Projects that are part of an organization */
export type Project = {
  __typename?: 'Project';
  /** unique identifier for the project */
  _id: Scalars['ID'];
  /** organization that the project belongs to */
  created: Scalars['DateTime'];
  /** description of the project */
  description: Scalars['String'];
  /** name of the project, unique in an organization */
  name: Scalars['String'];
};

export type ProjectAccessChange = {
  /** The ID of the dataset to change project access to */
  datasetID: Scalars['ID'];
  /** If the project should have access to the dataset */
  hasAccess: Scalars['Boolean'];
  /** The ID of the project to change access to */
  projectID: Scalars['ID'];
};

export type ProjectAdminChange = {
  /** Whether the user should have admin access to the project */
  hasAdminAccess: Scalars['Boolean'];
  /** The ID of the project to update */
  projectID: Scalars['ID'];
  /** The ID of the user to update */
  userID: Scalars['ID'];
};

export type ProjectCreate = {
  /** description of the project */
  description: Scalars['String'];
  /** name of the project, unique in an organization */
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  datasetExists: Scalars['Boolean'];
  exists: Scalars['Boolean'];
  findOrganization: Organization;
  getDatasets: Array<Dataset>;
  getDatasetsByProject: Array<Dataset>;
  getOrganizations: Array<Organization>;
  getPasswordComplexity: PasswordComplexity;
  getProjects: Array<Project>;
  projectExists: Scalars['Boolean'];
  userAvailable: UserAvailability;
};


export type QueryDatasetExistsArgs = {
  name: Scalars['String'];
};


export type QueryExistsArgs = {
  name: Scalars['String'];
};


export type QueryFindOrganizationArgs = {
  organization: Scalars['String'];
};


export type QueryGetDatasetsByProjectArgs = {
  project: Scalars['ID'];
};


export type QueryProjectExistsArgs = {
  name: Scalars['String'];
};


export type QueryUserAvailableArgs = {
  identification: UserIdentification;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  organization: Organization;
  roles: Scalars['JSON'];
  username: Scalars['String'];
};

export type UserAvailability = {
  __typename?: 'UserAvailability';
  email: Scalars['Boolean'];
  username: Scalars['Boolean'];
};

export type UserCredentials = {
  organization: Scalars['ID'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserIdentification = {
  email: Scalars['String'];
  organization: Scalars['ID'];
  username: Scalars['String'];
};

export type UserSignup = {
  email: Scalars['String'];
  name: Scalars['String'];
  organization: Scalars['ID'];
  password: Scalars['String'];
  username: Scalars['String'];
};
