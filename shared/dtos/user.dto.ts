import { Organization } from './organization.dto';

/**
 * Defines the format user credentials are in when attempting to login.
 */
export interface UserCredentials {
  username: string;
  organization: string;
  password: string;
}

/**
 * The two elements that are unique to each user (besides generated ID) and
 * can be used to identify a user.
 */
export interface UserIdentification {
  username: string;
  organization: string;
  email: string;
}

/**
 * The information needed to be provided when making a new user.
 */
export interface UserSignup {
  organization: string;
  username: string;
  email: string;
  name: string;
  password: string;
}

/**
 * Represents the availability of the user identication elements
 */
export interface UserAvailability {
  username: boolean;
  email: boolean;
}

/**
 * Representation of all information on a User
 */
export interface User {
  _id: string;
  organization: Organization;
  name: string;
  email: string;
  username: string;
  roles: {
    owner: boolean;
    projectAdmin: Map<string, boolean>;
    studyAdmin: Map<string, boolean>;
    studyContributor: Map<string, boolean>;
    studyVisible: Map<string, boolean>;
  }
}
