import { User } from './user.dto';

export interface Dataset {
  _id: string;
  name: string;
  description: string;
  creator: User;
}
