import { Project } from './project.dto';

/**
 * A study is a collection of tags related to a certain goal definined by
 * the project owner
 */
export interface Study {
  /** Unique identifier of the study in the SignLab instance */
  _id?: string;
  /** The name of the study as a human readable identifier */
  name: string;
  /** Description explaining the goal of the studuy */
  description: string;
  /** Instructions presented to taggers in the system */
  instructions: string;
  /** The project the study is a part of */
  project: Project | string;
  /**
   * Defines the format of the tag as well as how to display the tag.
   */
  tagSchema: {
    /** The format of the data itself */
    dataSchema: any;
    /** How the tag form should be displayed */
    uiSchema: any;
  }
}

/**
 * What is required for making a new study. This includes the study
 * information itself and the responses which will make up the training
 * set
 */
export interface StudyCreation {
  study: Omit<Study, 'project'>;
  /** The project the study will belong to */
  projectID: string;
  /** List of Response IDs which will be used for the training set */
  trainingEntries: string[];
  /** List of Response IDs which will be disabled for this study */
  disabledEntries: string[];
}
