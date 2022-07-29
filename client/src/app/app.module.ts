// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { FlexModule } from '@angular/flex-layout/flex';

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
import { TaggingInterface } from './components/tagging-interface/tagging-interface.component';
import { AslLexSignBankField } from './components/tagging-interface/custom-fields/asl-lex-field.component';
import { FirstTimeSetupComponent } from './components/first-time-setup/first-time-setup.component';
import { ResponseMetaForm } from './components/first-time-setup/response-meta-form.component';

// Routing
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from './modules/app-routing.module';

// Pipes
import { SafePipe } from './pipes/safe.pipe';

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
    ResponseUploadDialog,
    TaggingInterface,
    AslLexSignBankField,
    FirstTimeSetupComponent,
    SafePipe,
    ResponseMetaForm
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    FlexModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
