import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { DatasetControlComponent } from './components/dataset-control.component';
import { ProjectAccess } from './components/project-access.component';

const routes: Routes = [
  { path: 'dataset-control', component: DatasetControlComponent },
  { path: 'project-access', component: ProjectAccess },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatasetsRoutingModule {}
