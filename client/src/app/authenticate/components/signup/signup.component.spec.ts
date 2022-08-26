import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { SignupComponent } from "./signup.component";
import { AuthService } from '../../../core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SignupComponent', () => {
  // Test password complexity requirements
  const passwordComplexity = {
    min: 4,
    max: 32,
    lowerCase: 1,
    upperCase: 1,
    numeric: 0,
    symbol: 0,
    requirementCount: 4
  };

  // Unit under test
  let signup: ComponentFixture<SignupComponent>;
  // Spy auth service
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(fakeAsync(() => {
    // Setup signup component
    authSpy = jasmine.createSpyObj('AuthService',
                                   ['signup', 'getPasswordComplexity', 'isUserAvailable']);
    authSpy.getPasswordComplexity.and.returnValue(Promise.resolve(passwordComplexity));
    authSpy.isUserAvailable.and.returnValue(Promise.resolve({username: true, email: true}));

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ SignupComponent ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    });

    signup = TestBed.createComponent(SignupComponent);

    // Ensure that the complexity has been included
    signup.detectChanges();
    signup.componentInstance.ngOnInit();
    tick();
    signup.detectChanges();
  }));

  // Initially, the form should not be valid
  it('empty form should not be valid', fakeAsync(() => {
    // Each element in the form should not be valid
    expect(signup.componentInstance.name.valid).toBeFalse();
    expect(signup.componentInstance.email.valid).toBeFalse();
    expect(signup.componentInstance.username.valid).toBeFalse();
    expect(signup.componentInstance.pass.valid).toBeFalse();
    expect(signup.componentInstance.confirmPass?.valid).toBeFalse();

    // The whole form should not be valid
    expect(signup.componentInstance.signupForm.valid).toBeFalse();

    // Have the page fully render then ensure that the view matches
    // expectations
    signup.detectChanges();
    signup.componentInstance.ngOnInit();
    tick();
    signup.detectChanges();

    const compiled = signup.debugElement.nativeElement;
    const button = compiled.querySelector('button');

    expect(button.getAttribute('disabled')).not.toBeNull();
  }));

  // Filled out form should be valid
  it('correctly filled out form should be valid', fakeAsync(() => {
    // Fill in test information
    signup.componentInstance.name.setValue('Bob');
    signup.componentInstance.email.setValue('bob@bu.edu');
    signup.componentInstance.username.setValue('bob');
    signup.componentInstance.pass.setValue('Bobby');
    signup.componentInstance.confirmPass.setValue('Bobby');

    // Each element in the form should be valid
    expect(signup.componentInstance.name.valid).toBeTrue();
    expect(signup.componentInstance.email.valid).toBeTrue();
    expect(signup.componentInstance.pass.valid).toBeTrue();
    expect(signup.componentInstance.confirmPass.valid).toBeTrue();

    tick();
    signup.detectChanges();


    // The whole form should be valid
    expect(signup.componentInstance.signupForm.valid).toBeTrue();

    // Submit button should be enabled
    const compiled = signup.debugElement.nativeElement;
    const button = compiled.querySelector('button');

    expect(button.getAttribute('disabled')).toBeNull();
  }));

  // Form with invalid password
  it('should not accept password that does not meet complexity requirements', fakeAsync(() => {
    // Fill in form with everything valid expect for password complexity
    signup.componentInstance.name.setValue('Bob');
    signup.componentInstance.email.setValue('bob@bu.edu');
    signup.componentInstance.username.setValue('bob');
    signup.componentInstance.pass.setValue('bob'); // Need uppercase
    signup.componentInstance.confirmPass.setValue('bobby');

    // Each element except for the password should be valid
    expect(signup.componentInstance.name.valid).toBeTrue();
    expect(signup.componentInstance.email.valid).toBeTrue();
    expect(signup.componentInstance.pass.valid).toBeFalse();
    expect(signup.componentInstance.confirmPass.valid).toBeTrue();
  }));

  // Form with non-matching passwords
  it('should not accept non-matching passwords', fakeAsync(() => {
    // Fill in form with everything except matching passwords
    signup.componentInstance.name.setValue('Bob');
    signup.componentInstance.email.setValue('bob@bu.edu');
    signup.componentInstance.username.setValue('bob');
    signup.componentInstance.pass.setValue('Bobby');
    signup.componentInstance.confirmPass.setValue('BobbY'); // Mismatch with pass field

    // Every field should be valid
    expect(signup.componentInstance.name.valid).toBeTrue();
    expect(signup.componentInstance.email.valid).toBeTrue();
    expect(signup.componentInstance.pass.valid).toBeTrue();
    expect(signup.componentInstance.confirmPass.valid).toBeTrue();

    // The form itself should not be valid
    expect(signup.componentInstance.signupForm.valid).toBeFalse();
  }));

  // Calling signup with an invalid form should not call the authenticate
  // service's signup
  it('should not attempt to signup with invalid form', async () => {
    // Right now the form is empty and thus invalid
    await signup.componentInstance.signup();

    expect(authSpy.signup).toHaveBeenCalledTimes(0);
  });

  // Calling signup with a valid form should actually call the authenticate
  // service's signup
  it('should attempt to signup with a valid form', fakeAsync(async () => {
    // Fill in test information
    signup.componentInstance.name.setValue('Bob');
    signup.componentInstance.email.setValue('bob@bu.edu');
    signup.componentInstance.username.setValue('bob');
    signup.componentInstance.pass.setValue('Bobby');
    signup.componentInstance.confirmPass.setValue('Bobby');

    tick();
    signup.detectChanges();

    await signup.componentInstance.signup();
    expect(authSpy.signup).toHaveBeenCalledTimes(1);
  }));
});
