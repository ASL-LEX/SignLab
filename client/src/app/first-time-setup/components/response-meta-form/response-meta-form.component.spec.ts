import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ResponseService } from '../../../core/services/response.service';
import { ResponseMetaForm } from './response-meta-form.component';

describe('ResponseMetaForm', () => {
  // Unit under test
  let responseForm: ComponentFixture<ResponseMetaForm>;

  // Spy for the response service
  let responseSpy: jasmine.SpyObj<ResponseService>;

  beforeEach(() => {
    responseSpy = jasmine.createSpyObj('ResponseService', ['setMetadata']);

    TestBed.configureTestingModule({
      declarations: [ ResponseMetaForm ],
      providers: [
        { provide: ResponseService, useValue: responseSpy },
        FormBuilder
      ],
    });

    responseForm = TestBed.createComponent(ResponseMetaForm);
  });

  it('should allow additional fields to be added', () => {
    // First there should not be any fields
    let fields = responseForm.nativeElement.querySelectorAll('input');
    expect(fields.length).toEqual(0);

    // Next press the "add field button"
    const button = responseForm.nativeElement.querySelector('button');
    button.click();
    responseForm.detectChanges();

    // Ensure there is now 1 field
    fields = responseForm.nativeElement.querySelectorAll('input');
    expect(fields.length).toEqual(1);
  });

  it('should not enable button on invalid form', () => {
    // Add an empty field (field cannot be empty)
    responseForm.componentInstance.addMetaField();
    responseForm.detectChanges();

    // Ensure there is now a text box displaying an error
    const textBox = responseForm.nativeElement.querySelector('p');
    expect(textBox).toBeTruthy();
    expect(textBox.textContent).toContain('Ensure each field has a name and type and make sure the name is unique.');

    // Make sure the form is considered invalid
    expect(responseForm.componentInstance.responseMetadataFormGroup.valid).toBeFalse();
  });

  it('should consider an empty form to be valid', () => {
    expect(responseForm.componentInstance.responseMetadataFormGroup.valid).toBeTrue();
  });
});
