/**
 * Represents the information contained within a response.
 */
export interface Response {
  _id: string;
  responseID: string;
  videoURL: string;
  duration?: number;
  responderID?: string;
  enabled: boolean;
  meta: any;
}
