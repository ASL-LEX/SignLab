import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectGuard } from '../core/guards/project.guard';
import { NewProjectComponent } from './components/new-project.component';
import { UserPermissionsComponent } from './components/user-permissions.component';
import { ProjectTable } from './components/project-table.component';

const routes: Routes = [
  {
    path: 'user-permissions',
    component: UserPermissionsComponent,
    canActivate: [ProjectGuard]
  },
  {
    path: 'new-project',
    component: NewProjectComponent
  },
  {
    path: 'project-control',
    component: ProjectTable
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
