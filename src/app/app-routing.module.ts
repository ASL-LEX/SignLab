import { NgModule } from '@angular/core';

import { UserDashboardComponent } from "./components/user-dashboard/user-dashboard.component";
import { LoginComponent } from "./components/login/login.component";

import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: 'dash', component: UserDashboardComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
