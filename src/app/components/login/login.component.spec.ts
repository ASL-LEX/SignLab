import { LoginComponent } from "./login.component";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from "src/app/services/auth.service";

describe('LoginComponent', () => {
  // Unit under test
  let login: ComponentFixture<LoginComponent>;
  // Spy auth service
  let authSpy: jasmine.SpyObj<AuthService>;

  // Valid credentials for the mocked object
  const validUsername = 'test@bu.edu';
  const validPassword = 'password';

  beforeEach(async () => {
    // Make spy for authentication service
    authSpy = jasmine.createSpyObj('AuthService', ['authenticate']);
    authSpy.authenticate.and.callFake(async (username: string, password: string) => {
      if(username == validUsername && password == validPassword) {
        return 'bob';
      }
      return null;
    });

    // Setup login component
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ],
    });

    login = TestBed.createComponent(LoginComponent);
  });

  it(`should have fields for username and password`, () => {
    // Make sure the expected fields are present
    const compiled = login.nativeElement;
    expect(compiled.querySelector('input#email')).toBeTruthy();
    expect(compiled.querySelector('input#password')).toBeTruthy();
  });

  it(`should call authentication login`, () => {
    // Pass in valid authentication credentials
    login.componentInstance.email.setValue(validUsername);
    login.componentInstance.pass.setValue(validPassword);
    login.componentInstance.authenticateUser();

    // Ensure that authentication has been called
    expect(authSpy.authenticate).toHaveBeenCalledWith(validUsername, validPassword);

    // TODO: Test changes to page after authentication takes place
  });
});
