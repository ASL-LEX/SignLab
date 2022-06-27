import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/modules/material.module";
import { UserService } from "src/app/services/user.service";
import { UserControlComponent } from "./user-control.component";

describe('UserControlComponent', () => {
  const exampleUserData = [
    {
      email: 'bob@bu.edu',
      name: 'bob',
      roles: { admin: false, tagging: true },
      username: 'bob',
      _id: '10'
    },
    {
      email: 'test@bu.edu',
      name: 'test',
      roles: { tagging: true, recording: true },
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

    expect(userServiceSpy.getUsers).toHaveBeenCalled()
  });


  it('displays all of the users correctly', fakeAsync(async () => {
    // Have ngOnInit run
    userControl.detectChanges();

    flushMicrotasks();

    userControl.detectChanges();

    // Make sure all rows in the table are generated
    const compiled = userControl.debugElement.nativeElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(exampleUserData.length);

    // Make sure the check boxes match the roles
    tick();
    userControl.detectChanges();

    // First user
    const firstUserChecks = rows[0].querySelectorAll('input');
    expect(firstUserChecks[0].getAttribute('aria-checked')).toBe('false'); // Admin
    expect(firstUserChecks[1].getAttribute('aria-checked')).toBe('true'); // Tagging
    expect(firstUserChecks[2].getAttribute('aria-checked')).toBe('false'); // Recording

    // Second user
    const secondUserChecks = rows[1].querySelectorAll('input');
    expect(secondUserChecks[0].getAttribute('aria-checked')).toBe('false'); // Admin
    expect(secondUserChecks[1].getAttribute('aria-checked')).toBe('true'); // Tagging
    expect(secondUserChecks[2].getAttribute('aria-checked')).toBe('true'); // Recording
  }));

});
