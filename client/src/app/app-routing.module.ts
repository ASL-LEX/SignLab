import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard, OwnerAuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./authenticate/authenticate.module').then(
        (m) => m.AuthenticateModule
      ),
  },
  {
    path: 'tag',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./tagging-interface/tagging-interface.module').then(
        (m) => m.TaggingInterfaceModule
      ),
  },
  {
    path: 'owner',
    canActivate: [OwnerAuthGuard],
    loadChildren: () =>
      import('./owner-dashboard/owner-dashboard.module').then(
        (m) => m.OwnerDashboardModule
      ),
  },
  {
    path: 'studies',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./studies/studies.module').then((m) => m.StudiesModule),
  },
  {
    path: 'datasets',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./datasets/datasets.module').then((m) => m.DatasetsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
