import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../../../shared/dtos/user.dto';

@Component({
  selector: 'first-time-setup',
  templateUrl: './first-time-setup.component.html',
})
export class FirstTimeSetupComponent {
  /** Form thaat contains the activation code */
  activationFormGroup = this.formBuilder.group({
    code: ['', Validators.required]
  });
  /** Callback for when the first time setup has completed */
  @Input() onSetupComplete: () => void;

  /**
   * Used to control the stepper logic without having to reach into the signup
   * form and grap its form directly
   */
  ownerCreateGhostForm = this.formBuilder.group({
    empty: ['', Validators.required]
  });
  /**
   * Flag that controls the user either seeing a success message or the
   * signup view
   */
  hasCreatedUser = false;

  constructor(private formBuilder: FormBuilder) {
    this.userMade = this.userMade.bind(this);
    this.metadataSubmit = this.metadataSubmit.bind(this);
  }

  /**
   * Handles when the new project owner account has been made. Will
   * update the
   */
  userMade(_user: User) {
    this.ownerCreateGhostForm.get('empty')?.setValue('something');
    this.hasCreatedUser = true;
  }

  /**
   * Update the view back to the landing page when the metadata has been
   * submitted
   */
  metadataSubmit() {
    if (this.onSetupComplete) {
      this.onSetupComplete();
    }
  }
}
