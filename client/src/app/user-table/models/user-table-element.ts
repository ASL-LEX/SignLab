import { User } from 'shared/dtos/user.dto';
import { UserStudy } from 'shared/dtos/userstudy.dto';

/**
 * Contains information that may be needed to display the users. This includes
 * cases where the context of a study is also present
 */
export interface UserTableElement {
  user: User;
  userStudy?: UserStudy;
}

/**
 * Toggle changes made against the user.
 */
export interface UserToggleChange {
  user: User;
  /** The value that the user's admin status is being changed to */
  option: boolean;
}

/**
 * Toggle changes for user study information
 */
export interface UserStudyToggleChange {
  userStudy: UserStudy;
  option: boolean;
}
