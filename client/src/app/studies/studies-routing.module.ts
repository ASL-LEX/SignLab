import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudyGuard } from '../core/guards/study.guard';

// Components
import { UserPermissionsComponent } from './components/user-permissions.component';
import { EntryControlsComponent } from './components/entry-controls.component';
import { ContributeComponent } from './components/contribute.component';
import { NewStudyComponent } from './components/new-study/new-study.component';

const routes: Routes = [
  { path: 'user-permissions', component: UserPermissionsComponent, canActivate: [StudyGuard] },
  { path: 'entry-controls', component: EntryControlsComponent, canActivate: [StudyGuard] },
  { path: 'contribute', component: ContributeComponent, canActivate: [StudyGuard] },
  { path: 'create-new-study', component: NewStudyComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudiesRoutingModule {}
