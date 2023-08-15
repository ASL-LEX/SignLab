import { AbstractControl } from '@angular/forms';

/**
 * Implementation of an AbstractControl which allows the programmer to
 * manually mark the control as valid or invalid. This is useful in cases
 * where something typically uses a form/form validation but we want to
 * manually control if the control is considered valid not in the context
 * of a form.
 */
export class ManualControl extends AbstractControl {
  /** Represents if the control is valid or not */
  isValid: boolean;

  constructor() {
    super(null, null);
  }

  /** Marks the control as valid.*/
  markAsValid() {
    this.isValid = true;
  }

  /** Make the control as invalid */
  markAsInvalid() {
    this.isValid = false;
  }

  get valid(): boolean {
    return this.isValid;
  }

  get invalid(): boolean {
    return !this.valid;
  }

  // Placeholder for the abstract methods that need to be implemented.
  patchValue(_value: any, _options?: { onlySelf?: boolean; emitEvent?: boolean }) {}

  setValue(_value: any, _options?: { onlySelf?: boolean; emitEvent?: boolean }) {}

  reset(_value?: any, _options?: { onlySelf?: boolean; emitEvent?: boolean }) {}
}
