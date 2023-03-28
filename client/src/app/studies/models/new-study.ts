/**
 * The required meta information that is needed when making a new study.
 */
export interface NewStudyMeta {
  name: string;
  description: string;
  instructions: string;
  tagsPerEntry: number;
}
