import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <form class="login-form" (ngSubmit)="authenticateUser()">
          <label for="username" class="label">Enter Participant Username</label
          ><br />
          <input
            #usernameElement
            type="username"
            class="form-control"
            id="username"
            autocomplete="off"
            [formControl]="username"
            data-cy="usernameField"
          /><br />
          <label for="password" class="label">Enter Password</label><br />
          <input
            #passwordElement
            type="password"
            class="form-control"
            id="password"
            autocomplete="off"
            [formControl]="pass"
            data-cy="passwordField"
          /><br />
          <button
            mat-stroked-button
            class="button"
            type="submit"
            data-cy="loginSubmit"
          >
            Submit
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  /** Field for the users email */
  username = new FormControl('');
  /** Field of the users password */
  pass = new FormControl('');

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Called when the form is submitted. Will attempt to authenticate the user
   * and will notify the user on failure or re-route the user on success
   */
  async authenticateUser(): Promise<void> {
    // Don't try to login if email and password are not present
    if (!this.username.value || !this.pass.value) {
      alert('Please enter username and password');
      return;
    }

    // Attempt to login
    const user = await this.authService.authenticate(
      this.username.value,
      this.pass.value
    );

    if (user) {
      this.router.navigate(['/']);
    } else {
      alert('Username or password is invalid');
    }
  }
}
