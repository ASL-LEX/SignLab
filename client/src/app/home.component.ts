import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'home',
  template: `
    <h1>Welcome to SignLab</h1>

    <p *ngIf="!authService.isAuthenticated()">Please login to continue</p>

    <p *ngIf="authService.isAuthenticated()">
      Welcome {{ this.authService.user.name }}
    </p>
  `,
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
