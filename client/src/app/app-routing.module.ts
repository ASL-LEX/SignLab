import { NgModule } from '@angular/core';

import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./authenticate/authenticate.module')
      .then(m => m.AuthenticateModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module')
      .then(m => m.AdminDashboardModule)
  },
  {
    path: 'tag',
    loadChildren: () => import('./tagging-interface/tagging-interface.module')
      .then(m => m.TaggingInterfaceModule)
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
