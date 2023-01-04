import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

const routes: Routes = [
  { path: 'user-permissions', component: UserPermissionsComponent },
  { path: 'entry-controls', component: EntryControlsComponent },
  { path: 'contribute', component: ContributeComponent },
  { path: 'create-new-study', component: CreateNewStudyComponent },
];


@NgModule({
  import: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudiesRoutingModule {}
