import { User } from './user.dto';

export interface Project {
  /** The generated project ID */
  _id?: string;
  /** Name of the project, unique for an organization */
  name: string;
  /** Human readable description of the project */
  description: string;
  /** Date when the project was created */
  created: Date;
  /** The user who created the project */
  creator: User;
}

export interface ProjectCreate extends Omit<Project, '_id' | 'created' | 'creator'> {
  /** ID of the user who created the project */
  creator: string;
}
