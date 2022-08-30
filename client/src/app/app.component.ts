import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { BackendService } from './core/services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'SignLab';

  /**
   * Determines if the user should see the normal UI or the first time setup
   * UI
   */
  firstTimeSetup = false;

  constructor(
    private ngZone: NgZone,
    private backend: BackendService,
    public authService: AuthService
  ) {
    this.setupComplete = this.setupComplete.bind(this);
  }

  ngOnInit(): void {
    this.backend
      .isInFirstTimeSetup()
      .then((result) => (this.firstTimeSetup = result));
  }

  /**
   * When setup has completed, change the view
   */
  setupComplete() {
    this.ngZone.run(() => (this.firstTimeSetup = false));
  }
}
