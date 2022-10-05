import {
  Input,
  Component,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { UserStudy } from 'shared/dtos/userstudy.dto';
import {
  UserTableElement,
  UserStudyToggleChange,
  UserToggleChange,
} from '../models/user-table-element';

@Component({
  selector: 'user-table-core',
  templateUrl: './user-table-core.component.html',
  styleUrls: ['./user-table-core.component.css'],
})
export class UserTableCore implements OnChanges {
  /** Data the table is going to use for the display */
  @Input()
  userData: UserTableElement[] = [];
  /** The columns of the table to display */
  @Input()
  displayedColumns: string[] = [];
  /** Emit a change when the admin control option is changed */
  @Output()
  adminChange = new EventEmitter<UserToggleChange>();
  /** Emit event when the user is selected */
  @Output()
  userSelected = new EventEmitter<UserTableElement>();
  /** Emit event when the user is considered to be part of the study */
  @Output()
  taggingChange = new EventEmitter<UserStudyToggleChange>();
  /** Emit event when a request to download the users training results is made */
  @Output()
  downloadTrainingResultsRequest = new EventEmitter<UserStudy>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userData) {
      this.userData = changes.userData.currentValue;
    }
  }
}
