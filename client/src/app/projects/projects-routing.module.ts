import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewProjectComponent } from './components/new-project.component';

const routes: Routes = [
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
