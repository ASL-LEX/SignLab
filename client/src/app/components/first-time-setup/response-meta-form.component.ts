import { Component, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ResponseService } from 'src/app/services/response.service';

/**
 * Validator to check if each field in the form array has a unique name
 */
function uniqueValidator(control: AbstractControl) {
  const formArray = control as FormArray;
  const set = new Set<string>();

  for(let field of formArray.value) {
    // If the field with the given name is already present, returrn an error
    if (set.has(field.name)) {
      return { mustBeUnique: true };
    }
    set.add(field.name);
  }
  return null;
}

@Component({
  selector: 'response-meta-form',
  templateUrl: './response-meta-form.component.html',
  styleUrls: ['./response-meta-form.component.css']
})
export class ResponseMetaForm {
  /** Form that controls the fields of the metadata */
  responseMetadataFormGroup = this.formBuilder.group({
    responseMetadata: this.formBuilder.array([], uniqueValidator)
  });
  /** Callback for after the metadata has been submitted */
  @Input() onMetadataSubmit: () => void;

  constructor(private formBuilder: FormBuilder, private responseService: ResponseService) { }

  get responseMetadata() {
    return this.responseMetadataFormGroup.get('responseMetadata') as FormArray;
  }

  addMetaField() {
    const newForm: FormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
    this.responseMetadata.push(newForm);
  }

  /**
   * Remove a metdata field
   */
  deleteMetadata(index: number) {
    this.responseMetadata.removeAt(index);
  }

  /**
   * Submit the response meta data
   */
  submitMeta() {
    // TODO: Add "are you sure" validation
    this.responseService.setMetadata(this.responseMetadata.value);

    if (this.onMetadataSubmit) {
      this.onMetadataSubmit();
    }
  }
}
