import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationService } from '../../core/services/organization.service';
import { AuthService } from '../../core/services/auth.service';
import { Organization } from '../../graphql/graphql';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <form class="login-form" (ngSubmit)="authenticateUser()" *ngIf="(orgService.organizations | async) as organizations">
          <mat-form-field appearance="fill">
            <mat-label>Organization</mat-label>
            <mat-select
              data-cy="organizationField"
              [(ngModel)]="organizationValue"
              [ngModelOptions]="{standalone: true}"
            >
              <mat-option *ngFor="let organization of organizations" [value]="organization._id">
                {{organization.name}}
              </mat-option>
            </mat-select>
          </mat-form-field><br />

          <label for="username" class="label">Enter Participant Username</label><br />
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
          <button mat-stroked-button class="button" type="submit" data-cy="loginSubmit">Submit</button>
        </form>
      </mat-card>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** The organization the user is logging into */
  organization = new FormControl('');
  /** Field for the users email */
  username = new FormControl('');
  /** Field of the users password */
  pass = new FormControl('');

  organizationValue = '';

  constructor(private authService: AuthService, private router: Router, public orgService: OrganizationService) {}

  /**
   * Called when the form is submitted. Will attempt to authenticate the user
   * and will notify the user on failure or re-route the user on success
   */
  async authenticateUser(): Promise<void> {
    // Don't try to login if email and password are not present
    if (!this.username.value || !this.pass.value || !this.organizationValue) {
      alert('Please enter username, password, and organization');
      return;
    }

    // Attempt to login
    const user = await this.authService.authenticate(this.username.value!, this.pass.value!, this.organizationValue);

    if (user) {
      this.router.navigate(['/']);
    } else {
      alert('Username or password is invalid');
    }
  }

  async compareOrgs(orgA: Organization, orgB: Organization) {
    console.log(orgA);
    console.log(orgB);
    return (orgA && orgB) && (orgA._id == orgB._id);
  }
}
