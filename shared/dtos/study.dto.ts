/**
 * A study is a collection of tags related to a certain goal definined by
 * the project owner
 */
export interface Study {
  /** Unique identifier of the study in the SignLab instance */
  _id: string;
  /** The name of the study as a human readable identifier */
  name: string;
  /** Description explaining the goal of the studuy */
  description: string;
  /** Instructions presented to taggers in the system */
  instructions: string;
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
