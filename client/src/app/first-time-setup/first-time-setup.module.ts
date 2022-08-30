// Modules
import { NgModule } from '@angular/core';
import { AuthenticateModule } from '../authenticate/authenticate.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { FirstTimeSetupComponent } from './components/first-time-setup.component';
import { ResponseMetaForm } from './components/response-meta-form/response-meta-form.component';

@NgModule({
  declarations: [FirstTimeSetupComponent, ResponseMetaForm],
  imports: [SharedModule, AuthenticateModule],
  providers: [],
  exports: [FirstTimeSetupComponent],
})
export class FirstTimeSetupModule {}
