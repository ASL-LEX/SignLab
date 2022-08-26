import { Component, Input, OnInit } from '@angular/core';
import {
    AbstractControl, FormControl, FormGroup, ValidationErrors,
    ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplexityOptions, default as passwordValidate } from 'joi-password-complexity';
import { User } from '../../../../../../shared/dtos/user.dto';

import { AuthService } from '../../../core/services/auth.service';


/**
 * Custom form validator which ensures the password complexity meets
 * requirements
 */
function complexityValidator(complexity: ComplexityOptions): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = passwordValidate(complexity, 'password').validate(control.value);
    if(result.error) {
      return { complexity: result.error.message };
    }
    return null;
  }
}

/**
 * Ensure that the two control fields have matching values
 *
 * @param firstControl The name of the first control element to check
 * @param secondControl The name of the second control element to check
 *
 */
function mustMatch(firstControl: string, secondControl: string): ValidatorFn {
  return (formGroup: AbstractControl) => {
    // Get the form control elements
    const first = formGroup.get(firstControl);
    const second = formGroup.get(secondControl);

    // If the form controls don't exist, throw an error
    if(!first) {
      throw new Error(`${firstControl} does not exist in Form`);
    }
    if(!second) {
      throw new Error(`${secondControl} does not exist in Form`);
    }

    if(first.value != second.value) {
      return { mustMatch: true };
    }

    return null;
  };
}

/**
 * Validator that always fails, this is useful when you plan on replacing the
 * validator later and before the validator is added no input should be
 * considered valid.
 */
function alwaysInvalid(_control: AbstractControl) {
    return { alwaysInvalid: true };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  /** The form group for the signup */
  signupForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      // Give the password field a validator that always is invalid so that
      // the password field can only be validated after the complexity is
      // retrieved and added to the field
      pass: new FormControl('', [alwaysInvalid]),
      confirmPass: new FormControl('', [Validators.required])
    },
    mustMatch('pass', 'confirmPass')
  );

  /** Callback which is called once the signup has taken place */
  @Input() onUserSignup: (user: User) => void;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Get the password requirements
    this.authService.getPasswordComplexity().then((passwordComplexity) => {
      // Add the password complexity validator
      this.signupForm.get('pass')?.setValidators(complexityValidator(passwordComplexity));
    });
  }

  get name() { return this.signupForm.get('name')!; }
  get email() { return this.signupForm.get('email')!; }
  get username() { return this.signupForm.get('username')!; }
  get pass() { return this.signupForm.get('pass')!; }
  get confirmPass() { return this.signupForm.get('confirmPass')!; }

  /**
   * Called when the form is submitted. Will attempt to authenticate the user
   * and will notify the user on failure or re-route the user on success
   */
  async signup(): Promise<void> {
    // Don't attempt to signup if the form is invalid
    if(this.signupForm.invalid) {
      alert('Please complete the signup form');
      return;
    }

    // See if the username and email is available
    const availability =
        await this.authService.isUserAvailable(this.username.value!, this.email.value!);

    // If the username/email is not available, notify the user and
    // don't attempt to signup
    let message = '';
    if(!availability.username) {
      message += `${this.username.value!} is not an available username\n`;
    }
    if(!availability.email) {
      message += `${this.email.value!} is not an available email`;
    }
    if(message != '') {
      alert(message);
      return;
    }

    // Attempt to signup the user
    const result = await this.authService.signup(this.name.value!, this.email.value!,
                                           this.username.value!, this.pass.value!);

    // Run the callback for when the user has signed in
    if (this.onUserSignup) {
      this.onUserSignup(result);
    } else {
      this.router.navigate(['/']);
    }
  }
}
