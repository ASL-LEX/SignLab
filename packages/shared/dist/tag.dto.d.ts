import { Entry } from './entry.dto';
import { User } from './user.dto';
import { Study } from './study.dto';
export interface Tag {
    _id: string;
    entry: Entry;
    study: Study;
    user: User;
    complete: boolean;
    isTraining: boolean;
    info: any;
}
