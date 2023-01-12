import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewProjectComponent } from './components/new-project.component';
import { UserPermissionsComponent } from './components/user-permissions.component';

const routes: Routes = [
  {
    path: 'user-permissions',
    component: UserPermissionsComponent,
  },
  {
    path: 'new-project',
    component: NewProjectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
