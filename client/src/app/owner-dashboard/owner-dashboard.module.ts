import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { OwnerLandingComponent } from './components/owner-landing.component';
import { OwnerDashboardRoutingModule } from './owner-dashboard-routing.module';

@NgModule({
  declarations: [OwnerLandingComponent],
  imports: [SharedModule, OwnerDashboardRoutingModule],
})
export class OwnerDashboardModule {}
