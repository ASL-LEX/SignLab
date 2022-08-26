import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AdminAuthGuard, AuthenticatedGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./authenticate/authenticate.module')
      .then(m => m.AuthenticateModule)
  },
  {
    path: 'admin',
    canActivate: [AdminAuthGuard],
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module')
      .then(m => m.AdminDashboardModule)
  },
  {
    path: 'tag',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./tagging-interface/tagging-interface.module')
      .then(m => m.TaggingInterfaceModule)
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
