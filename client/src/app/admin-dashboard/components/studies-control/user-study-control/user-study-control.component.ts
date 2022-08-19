import { Component } from '@angular/core';

@Component({
  selector: 'user-study-control',
  templateUrl: './user-study-control.component.html',
  styleUrls: ['./user-study-control.component.css' ]
})
export class UserStudyComponent {
  displayedColumns = ['username', 'name', 'email', 'taggingTrainingResults', 'canTag'];
  userData = [
    {
      username: 'bob',
      name: 'bobby',
      email: 'bob@bu.edu',
      taggingTrainingComplete: false,
    },
    {
      username: 'sam',
      name: 'sammy',
      email: 'sam@bu.edu',
      taggingTrainingComplete: false
    },
    {
      username: 'mary',
      name: 'mary',
      email: 'maary@bu.edu',
      taggingTrainingComplete: false
    },
  ];
}
