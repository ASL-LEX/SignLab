import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

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
    authSpy.authenticate.and.callFake(
      async (username: string, password: string) => {
        if (username == validUsername && password == validPassword) {
          return {
            email: 'bob@bu.edu',
            name: 'bob',
            password: 'hi',
            roles: {
              admin: false,
              tagging: false,
              recording: false,
              accessing: false,
              owner: false,
            },
            username: 'bob',
            _id: 'sadlkfj',
          };
        }
        return null;
      }
    );

    // Setup login component
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authSpy }],
    });

    login = TestBed.createComponent(LoginComponent);
  });

  it(`should have fields for username and password`, () => {
    // Make sure the expected fields are present
    const compiled = login.nativeElement;
    expect(compiled.querySelector('input#username')).toBeTruthy();
    expect(compiled.querySelector('input#password')).toBeTruthy();
  });

  it(`should call authentication login`, () => {
    // Pass in valid authentication credentials
    login.componentInstance.username.setValue(validUsername);
    login.componentInstance.pass.setValue(validPassword);
    login.componentInstance.authenticateUser();

    // Ensure that authentication has been called
    expect(authSpy.authenticate).toHaveBeenCalledWith(
      validUsername,
      validPassword
    );

    // TODO: Test changes to page after authentication takes place
  });
});
