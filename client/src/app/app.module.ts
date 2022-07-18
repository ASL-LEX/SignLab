// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserControlComponent } from './components/admin-dashboard/user-control/user-control.component';
import { ResponseControlComponent } from './components/admin-dashboard/response-control/response-control.component';
import { AuthenticateComponent } from './components/authentication/authenticate.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { ResponseUploadDialog } from './components/admin-dashboard/response-control/response-upload-dialog.component';

// Routing
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from './modules/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    UserDashboardComponent,
    LoginComponent,
    AdminDashboardComponent,
    UserControlComponent,
    ResponseControlComponent,
    AuthenticateComponent,
    SignupComponent,
    ResponseUploadDialog
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
