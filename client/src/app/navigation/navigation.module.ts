import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar.component';
import { EnvironmentSelect } from './components/environment-select.component';

@NgModule({
  declarations: [NavbarComponent, EnvironmentSelect],
  imports: [SharedModule, RouterModule],
  exports: [NavbarComponent],
})
export class NavigationModule {}
