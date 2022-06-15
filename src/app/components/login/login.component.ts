import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** Field for the users email */
  email = new FormControl('');
  /** Field of the users password */
  pass = new FormControl('');

  constructor(private authService: AuthService) { }

  /**
   * Called when the form is submitted. Will attempt to authenticate the user
   * and will notify the user on failure or re-route the user on success
   */
  async authenticateUser(): Promise<void> {
    // Don't try to login if email and password are not present
    if(!this.email.value || !this.pass.value) {
      alert('Please enter email and password');
      return;
    }

    // Attempt to login
    const user = await this.authService.authenticate(this.email.value, this.pass.value)

    if(user) {
      // TODO: Reroute to dashboard
      console.log('Success');
    } else {
      alert('Email or password is invalid');
    }
  }
}
