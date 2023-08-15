import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaggingLanding } from './components/tagging-landing.component';
import { StudyGuard } from '../core/guards/study.guard';

const routes: Routes = [{ path: '', component: TaggingLanding, canActivate: [StudyGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaggingInterfaceRoutingModule {}
