import { User } from './user.dto';
import { Study } from './study.dto';
import { EntryStudy } from './entrystudy.dto';
export interface UserStudy {
    _id?: string;
    user: User;
    study: Study;
    trainingEntryStudies: EntryStudy[];
}
