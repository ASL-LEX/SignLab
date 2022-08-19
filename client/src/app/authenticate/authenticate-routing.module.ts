import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticateComponent } from './components/authenticate.component';

const routes: Routes = [
  { path: '', component: AuthenticateComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AuthenticateRoutingModule { }
