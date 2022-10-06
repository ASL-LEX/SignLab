import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { EntryService } from '../../../core/services/entry.service';
import { EntryMetaForm } from './entry-meta-form.component';

describe('EntryMetaForm', () => {
  // Unit under test
  let entryForm: ComponentFixture<EntryMetaForm>;

  // Spy for the entry service
  let entrySpy: jasmine.SpyObj<EntryService>;

  beforeEach(() => {
    entrySpy = jasmine.createSpyObj('EntryService', ['setMetadata']);

    TestBed.configureTestingModule({
      declarations: [EntryMetaForm],
      providers: [{ provide: EntryService, useValue: entrySpy }, FormBuilder],
    });

    entryForm = TestBed.createComponent(EntryMetaForm);
  });

  it('should allow additional fields to be added', () => {
    // First there should not be any fields
    let fields = entryForm.nativeElement.querySelectorAll('input');
    expect(fields.length).toEqual(0);

    // Next press the "add field button"
    const button = entryForm.nativeElement.querySelector('button');
    button.click();
    entryForm.detectChanges();

    // Ensure there is now 1 field
    fields = entryForm.nativeElement.querySelectorAll('input');
    expect(fields.length).toEqual(1);
  });

  it('should not enable button on invalid form', () => {
    // Add an empty field (field cannot be empty)
    entryForm.componentInstance.addMetaField();
    entryForm.detectChanges();

    // Ensure there is now a text box displaying an error
    const textBox = entryForm.nativeElement.querySelector('p');
    expect(textBox).toBeTruthy();
    expect(textBox.textContent).toContain(
      'Ensure each field has a name and type and make sure the name is unique.'
    );

    // Make sure the form is considered invalid
    expect(
      entryForm.componentInstance.entryMetadataFormGroup.valid
    ).toBeFalse();
  });

  it('should consider an empty form to be valid', () => {
    expect(entryForm.componentInstance.entryMetadataFormGroup.valid).toBeTrue();
  });
});
