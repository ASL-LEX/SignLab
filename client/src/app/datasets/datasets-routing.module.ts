import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { DatasetControlComponent } from './components/dataset-control.component';

const routes: Routes = [
  { path: 'dataset-control', component: DatasetControlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatasetsRoutingModule {}
