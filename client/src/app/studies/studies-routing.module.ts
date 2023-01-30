import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudyGuard } from '../core/guards/study.guard';

// Components
import { UserPermissionsComponent } from './components/user-permissions.component';
import { EntryControlsComponent } from './components/entry-controls.component';
import { NewStudyComponent } from './components/new-study/new-study.component';
import { TagViewComponent } from './components/tag-view.component';

const routes: Routes = [
  {
    path: 'user-permissions',
    component: UserPermissionsComponent,
    canActivate: [StudyGuard]
  },
  {
    path: 'entry-controls',
    component: EntryControlsComponent,
    canActivate: [StudyGuard]
  },
  { path: 'create-new-study', component: NewStudyComponent },
  {
    path: 'tag-download',
    component: TagViewComponent,
    canActivate: [StudyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudiesRoutingModule {}
