import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { UserPermissionsComponent } from './components/user-permissions.component';
import { EntryControlsComponent } from './components/entry-controls.component';
import { ContributeComponent } from './components/contribute.component';
import { NewStudyComponent } from './components/new-study.component';

const routes: Routes = [
  { path: 'user-permissions', component: UserPermissionsComponent },
  { path: 'entry-controls', component: EntryControlsComponent },
  { path: 'contribute', component: ContributeComponent },
  { path: 'create-new-study', component: NewStudyComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudiesRoutingModule {}
