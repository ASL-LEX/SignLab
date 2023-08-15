import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `
    <mat-tab-group mat-align-tabs="center">
      <mat-tab label="Login">
        <app-login></app-login>
      </mat-tab>
      <mat-tab label="Signup">
        <app-signup></app-signup>
      </mat-tab>
    </mat-tab-group>
  `
})
export class AuthenticateComponent {}
