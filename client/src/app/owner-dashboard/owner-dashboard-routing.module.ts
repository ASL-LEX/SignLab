import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerLandingComponent } from './components/owner-landing.component';

const routes: Routes = [{ path: '', component: OwnerLandingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerDashboardRoutingModule {}
