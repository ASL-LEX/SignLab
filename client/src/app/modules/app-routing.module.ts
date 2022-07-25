import { NgModule } from '@angular/core';

import { UserDashboardComponent } from "../components/user-dashboard/user-dashboard.component";
import { AdminDashboardComponent } from "../components/admin-dashboard/admin-dashboard.component";
import { AuthenticateComponent } from "../components/authentication/authenticate.component";
import { TaggingInterface } from '../components/tagging-interface/tagging-interface.component';

import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: 'dash', component: UserDashboardComponent },
  { path: 'auth', component: AuthenticateComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'tag', component: TaggingInterface }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
