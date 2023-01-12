import { NgModule } from '@angular/core';
import { CoreModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { NewProjectComponent } from './components/new-project.component';
import { ProjectRoutingModule } from './projects-routing.module';
import { UserPermissionsComponent } from './components/user-permissions.component';

@NgModule({
  declarations: [NewProjectComponent, UserPermissionsComponent],
  imports: [CoreModule, SharedModule, ProjectRoutingModule],
})
export class ProjectsModule {}
