import { NgModule } from '@angular/core';

import { UserDashboardComponent } from "../components/user-dashboard/user-dashboard.component";
import { AdminDashboardComponent } from "../components/admin-dashboard/admin-dashboard.component";
import { AuthenticateComponent } from "../components/authentication/authenticate.component";

import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: 'dash', component: UserDashboardComponent },
  { path: 'auth', component: AuthenticateComponent },
  { path: 'admin', component: AdminDashboardComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
