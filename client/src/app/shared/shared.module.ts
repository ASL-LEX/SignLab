// Components
import { AslLexSignBankField } from './components/custom-fields/asl-lex-field.component';
import { FileListField } from './components/custom-fields/file-list.component';
import { VideoOptionField } from './components/custom-fields/video-option-field.component';

// Modules
import { NgModule } from '@angular/core';
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { FlexModule } from '@angular/flex-layout/flex';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';

// Pipes
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [AslLexSignBankField, FileListField, SafePipe, VideoOptionField],
  imports: [
    FormsModule,
    MaterialModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    FlexModule,
  ],
  exports: [
    AslLexSignBankField,
    FileListField,
    SafePipe,
    FormsModule,
    MaterialModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    FlexModule,
  ],
})
export class SharedModule {}
