import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard, OwnerAuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home.component';
import { ProjectGuard } from './core/guards/project.guard';

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
    canActivate: [AuthenticatedGuard, ProjectGuard],
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
    canActivate: [AuthenticatedGuard, ProjectGuard],
    loadChildren: () =>
      import('./studies/studies.module').then((m) => m.StudiesModule),
  },
  {
    path: 'datasets',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./datasets/datasets.module').then((m) => m.DatasetsModule),
  },
  {
    path: 'projects',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./projects/projects.module').then((m) => m.ProjectsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
