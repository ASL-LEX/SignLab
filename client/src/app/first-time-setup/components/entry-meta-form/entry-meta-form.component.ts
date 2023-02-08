import { Component, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EntryService } from '../../../core/services/entry.service';

/**
 * Validator to check if each field in the form array has a unique name
 */
function uniqueValidator(control: AbstractControl) {
  const formArray = control as FormArray;
  const set = new Set<string>();

  for (const field of formArray.value) {
    // If the field with the given name is already present, returrn an error
    if (set.has(field.name)) {
      return { mustBeUnique: true };
    }
    set.add(field.name);
  }
  return null;
}

@Component({
  selector: 'entry-meta-form',
  templateUrl: './entry-meta-form.component.html'
})
export class EntryMetaForm {
  /** Form that controls the fields of the metadata */
  entryMetadataFormGroup: FormGroup;
  /** Callback for after the metadata has been submitted */
  @Input() onMetadataSubmit: () => void;

  constructor(private formBuilder: FormBuilder, private entryService: EntryService) {
    this.entryMetadataFormGroup = this.formBuilder.group({
      entryMetadata: this.formBuilder.array([], uniqueValidator)
    });
  }

  get entryMetadata() {
    return this.entryMetadataFormGroup.get('entryMetadata') as FormArray;
  }

  addMetaField() {
    const newForm: FormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
    this.entryMetadata.push(newForm);
  }

  /**
   * Remove a metdata field
   */
  deleteMetadata(index: number) {
    this.entryMetadata.removeAt(index);
  }

  /**
   * Submit the entry meta data
   */
  submitMeta() {
    // TODO: Add "are you sure" validation
    this.entryService.setMetadata(this.entryMetadata.value);

    if (this.onMetadataSubmit) {
      this.onMetadataSubmit();
    }
  }
}
