// Modules
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthenticateRoutingModule } from './authenticate-routing.module';

// Components
import { AuthenticateComponent } from './components/authenticate.component';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup/signup.component';

@NgModule({
  declarations: [AuthenticateComponent, LoginComponent, SignupComponent],
  imports: [SharedModule, AuthenticateRoutingModule],
  providers: [],
  exports: [AuthenticateComponent, SignupComponent],
})
export class AuthenticateModule {}
