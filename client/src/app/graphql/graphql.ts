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
};

export type Mutation = {
  __typename?: 'Mutation';
  createProjects: Project;
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

export type Query = {
  __typename?: 'Query';
  getProjects: Array<Project>;
  projectAdminControl: Scalars['Boolean'];
  projectExists: Scalars['Boolean'];
};
