/**
 * Defines the format user credentials are in when attempting to login.
 */
export interface UserCredentials {
  username: string;
  password: string;
}

/**
 * The two elements that are unique to each user (besides generated ID) and
 * can be used to identify a user.
 */
export interface UserIdentification {
  username: string;
  email: string;
}

/**
 * The information needed to be provided when making a new user.
 */
export interface UserSignup {
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
