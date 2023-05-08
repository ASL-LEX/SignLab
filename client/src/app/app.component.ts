import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SignLab';

  /**
   * Determines if the user should see the normal UI or the first time setup
   * UI
   */
  firstTimeSetup = false;

  constructor(
    private ngZone: NgZone,
    public authService: AuthService,
    private router: Router
  ) {
    this.setupComplete = this.setupComplete.bind(this);
  }


  /**
   * When setup has completed, change the view
   */
  setupComplete() {
    this.ngZone.run(() => (this.firstTimeSetup = false));
  }

  /**
   * Logout the user and re-direct to the login page
   */
  logout(): void {
    this.authService.signOut();
    this.router.navigate(['/auth']);
  }
}
