import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { NewStudyComponent } from './components/studies-control/new-study/new-study.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'new_study', component: NewStudyComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AdminDashboardRoutingModule { }
