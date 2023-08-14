/* eslint-disable */
import * as Types from '../graphql';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type PasswordComplexityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PasswordComplexityQuery = { __typename?: 'Query', getPasswordComplexity: { __typename?: 'PasswordComplexity', min?: number | null, max?: number | null, lowerCase?: number | null, upperCase?: number | null, numeric?: number | null, symbol?: number | null, requirementCount?: number | null } };

export type LoginMutationVariables = Types.Exact<{
  credentials: Types.UserCredentials;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', _id: string, username: string, email: string, name: string, roles: any, organization: { __typename?: 'Organization', _id: string, name: string } } } };

export type SignupMutationVariables = Types.Exact<{
  credentials: Types.UserSignup;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', _id: string, username: string, email: string, name: string, roles: any, organization: { __typename?: 'Organization', _id: string, name: string } } } };

export type UserAvailableQueryVariables = Types.Exact<{
  identification: Types.UserIdentification;
}>;


export type UserAvailableQuery = { __typename?: 'Query', userAvailable: { __typename?: 'UserAvailability', username: boolean, email: boolean } };

export const PasswordComplexityDocument = gql`
    query passwordComplexity {
  getPasswordComplexity {
    min
    max
    lowerCase
    upperCase
    numeric
    symbol
    requirementCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PasswordComplexityGQL extends Apollo.Query<PasswordComplexityQuery, PasswordComplexityQueryVariables> {
    document = PasswordComplexityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginDocument = gql`
    mutation login($credentials: UserCredentials!) {
  login(credentials: $credentials) {
    user {
      _id
      username
      email
      name
      roles
      organization {
        _id
        name
      }
    }
    token
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SignupDocument = gql`
    mutation signup($credentials: UserSignup!) {
  signup(credentials: $credentials) {
    user {
      _id
      username
      email
      name
      roles
      organization {
        _id
        name
      }
    }
    token
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SignupGQL extends Apollo.Mutation<SignupMutation, SignupMutationVariables> {
    document = SignupDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserAvailableDocument = gql`
    query userAvailable($identification: UserIdentification!) {
  userAvailable(identification: $identification) {
    username
    email
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserAvailableGQL extends Apollo.Query<UserAvailableQuery, UserAvailableQueryVariables> {
    document = UserAvailableDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }