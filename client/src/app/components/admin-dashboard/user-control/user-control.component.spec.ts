import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/modules/material.module";
import { UserService } from "src/app/services/user.service";
import { UserControlComponent } from "./user-control.component";

describe('UserControlComponent', () => {
  const exampleUserData = [
    {
      email: 'bob@bu.edu',
      name: 'bob',
      username: 'bob',
      roles: {
        admin: false,
        tagging: true,
        recording: false,
        accessing: false,
        owner: false,
      },
      _id: '10'
    },
    {
      email: 'test@bu.edu',
      name: 'test',
      roles: {
        admin: true,
        tagging: true,
        recording: false,
        accessing: false,
        owner: false
      },
      username: 'test',
      _id: '11'
    }
  ];

  // The user service spy for serving fake data
  let userServiceSpy: jasmine.SpyObj<UserService>;
  // Test component
  let userControl: ComponentFixture<UserControlComponent>;

  beforeEach(() => {
    // Make the user service spy
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    userServiceSpy.getUsers.and.returnValue(Promise.resolve(exampleUserData));

    // Make the test component
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule
      ],
      declarations: [ UserControlComponent ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
      ]
    });

    userControl = TestBed.createComponent(UserControlComponent);
  });

  it('grabs the users from the user service', () => {
    userControl.detectChanges(); // Have ngOnInit run

    expect(userServiceSpy.getUsers).toHaveBeenCalled();
  });
});
