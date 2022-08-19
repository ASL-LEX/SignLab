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

// Components
import { AppComponent } from './app.component';

// Routing
import { RouterModule } from "@angular/router";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    AdminDashboardModule,
    FirstTimeSetupModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
