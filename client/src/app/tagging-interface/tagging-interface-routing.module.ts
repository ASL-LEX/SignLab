import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaggingInterface } from './components/tagging-interface.component';

const routes: Routes = [
  { path: '', component: TaggingInterface },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TaggingInterfaceRoutingModule { }
