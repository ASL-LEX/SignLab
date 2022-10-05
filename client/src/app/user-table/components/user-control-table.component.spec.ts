import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';
import { UserService } from '../../core/services/user.service';
import { UserControlTable } from './user-control-table.component';
import { UserTableCore } from './user-table-core.component';

describe('UserControlComponent', () => {
  const exampleUserData = [
    {
      email: 'bob@bu.edu',
      name: 'bob',
      username: 'bob',
      password: 'hi',
      roles: {
        admin: false,
        tagging: true,
        recording: false,
        accessing: false,
        owner: false,
      },
      _id: '10',
    },
    {
      email: 'test@bu.edu',
      name: 'test',
      password: 'hi',
      roles: {
        admin: true,
        tagging: true,
        recording: false,
        accessing: false,
        owner: false,
      },
      username: 'test',
      _id: '11',
    },
  ];

  // The user service spy for serving fake data
  let userServiceSpy: jasmine.SpyObj<UserService>;
  // Test component
  let userControl: ComponentFixture<UserControlTable>;

  beforeEach(() => {
    // Make the user service spy
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    userServiceSpy.getUsers.and.returnValue(Promise.resolve(exampleUserData));

    // Make the test component
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [UserControlTable, UserTableCore],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    });

    userControl = TestBed.createComponent(UserControlTable);
  });

  it('grabs the users from the user service', () => {
    userControl.detectChanges(); // Have ngOnInit run

    expect(userServiceSpy.getUsers).toHaveBeenCalled();
  });
});
