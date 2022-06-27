import { NgModule } from '@angular/core';

import { UserDashboardComponent } from "../components/user-dashboard/user-dashboard.component";
import { LoginComponent } from "../components/login/login.component";
import { AdminDashboardComponent } from "../components/admin-dashboard/admin-dashboard.component";

import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: 'dash', component: UserDashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
