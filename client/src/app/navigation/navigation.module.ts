import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar.component';
import { StudySelect } from './components/study-select.component';

@NgModule({
  declarations: [NavbarComponent, StudySelect],
  imports: [SharedModule, RouterModule],
  exports: [NavbarComponent],
})
export class NavigationModule {}
