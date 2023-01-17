export interface Project {
  /** The generated project ID */
  _id?: string;
  /** Name of the project, unique for an organization */
  name: string;
  /** Human readable description of the project */
  description: string;
  /** Date when the project was created */
  created: Date;
}

export interface ProjectCreate extends Omit<Project, '_id' | 'created'> {}
