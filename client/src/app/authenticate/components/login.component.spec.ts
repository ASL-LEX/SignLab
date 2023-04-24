import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { OrganizationService } from '../../core/services/organization.service';
import { BehaviorSubject } from 'rxjs';

describe('LoginComponent', () => {
  // Unit under test
  let login: ComponentFixture<LoginComponent>;
  // Spy auth service
  let authSpy: jasmine.SpyObj<AuthService>;
  let orgSpy: jasmine.SpyObj<OrganizationService>;

  // Valid credentials for the mocked object
  const validUsername = 'test@bu.edu';
  const validPassword = 'password';

  beforeEach(async () => {
    // Make spy for authentication service
    authSpy = jasmine.createSpyObj('AuthService', ['authenticate']);
    authSpy.authenticate.and.callFake(async (username: string, password: string) => {
      if (username == validUsername && password == validPassword) {
        return {
          email: 'bob@bu.edu',
          name: 'bob',
          password: 'hi',
          roles: {
            owner: false,
            studyContributor: new Map<string, boolean>(),
            projectAdmin: new Map<string, boolean>(),
            studyAdmin: new Map<string, boolean>(),
            studyVisible: new Map<string, boolean>()
          },
          username: 'bob',
          _id: 'sadlkfj',
          organization: {
            _id: '1',
            name: 'ASL-LEX'
          }
        };
      }
      return null;
    });

    orgSpy = jasmine.createSpyObj('OrganizationService', [], {
      organizations: new BehaviorSubject([
        {
          _id: '1',
          name: 'ASL-LEX'
        }
      ])
    });

    // Setup login component
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authSpy }, { provide: OrganizationService, useValue: orgSpy }]
    });

    login = TestBed.createComponent(LoginComponent);
  });

  it(`should call authentication login`, () => {
    // Pass in valid authentication credentials
    login.componentInstance.username.setValue(validUsername);
    login.componentInstance.pass.setValue(validPassword);
    login.componentInstance.organizationValue = '1';
    login.componentInstance.authenticateUser();

    // Ensure that authentication has been called
    expect(authSpy.authenticate).toHaveBeenCalledWith(validUsername, validPassword, '1');

    // TODO: Test changes to page after authentication takes place
  });
});
