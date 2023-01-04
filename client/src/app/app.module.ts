// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { FirstTimeSetupModule } from './first-time-setup/first-time-setup.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { NavigationModule } from './navigation/navigation.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

// Routing
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    AdminDashboardModule,
    FirstTimeSetupModule,
    CoreModule.forRoot(),
    NavigationModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
