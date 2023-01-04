import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar.component';

@NgModule({
  declarations: [NavbarComponent],
  imports: [SharedModule],
  exports: [NavbarComponent]
})
export class NavigationModule { }
