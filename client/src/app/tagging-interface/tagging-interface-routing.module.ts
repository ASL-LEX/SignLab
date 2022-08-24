import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {TaggingLanding} from './components/tagging-landing.component';

const routes: Routes = [
  { path: '', component: TaggingLanding },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TaggingInterfaceRoutingModule { }
