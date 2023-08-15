import { Dataset } from './dataset.dto';
import { User } from './user.dto';
export interface LocationInfo {
    place: string;
    message: string;
}
export interface SaveAttempt {
    type: 'success' | 'warning' | 'error';
    message?: string;
    where?: LocationInfo[];
}
export interface Entry {
    _id?: string;
    entryID: string;
    mediaURL: string;
    mediaType: 'video' | 'image';
    duration?: number;
    recordedInSignLab: boolean;
    responderID?: string;
    dataset: Dataset;
    creator: User;
    dateCreated: Date;
    meta: any;
}
export interface MetadataDefinition {
    name: string;
    type: 'string' | 'number' | 'boolean';
}
