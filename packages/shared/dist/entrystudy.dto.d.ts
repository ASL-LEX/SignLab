import { Entry } from './entry.dto';
import { Study } from './study.dto';
export interface EntryStudy {
    _id?: string;
    entry: Entry;
    study: Study;
    isPartOfStudy: boolean;
    isUsedForTraining: boolean;
    numberTags: number;
    tags: string[];
}
