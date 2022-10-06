// Modules
import { NgModule } from '@angular/core';
import { AuthenticateModule } from '../authenticate/authenticate.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { FirstTimeSetupComponent } from './components/first-time-setup.component';
import { EntryMetaForm } from './components/entry-meta-form/entry-meta-form.component';

@NgModule({
  declarations: [FirstTimeSetupComponent, EntryMetaForm],
  imports: [SharedModule, AuthenticateModule],
  providers: [],
  exports: [FirstTimeSetupComponent],
})
export class FirstTimeSetupModule {}
