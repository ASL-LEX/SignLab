import { NgModule } from '@angular/core';
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: 'dash', component: UserDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
