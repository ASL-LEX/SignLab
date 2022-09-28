// Components
import { AslLexSignBankField } from './components/custom-fields/asl-lex-field.component';
import { FileListField } from './components/custom-fields/file-list.component';
import { VideoOptionField } from './components/custom-fields/video-option-field.component';
import { UserVideoOption } from './components/custom-fields/user-video-option-field.component';
import { VideoOptionUpload } from './components/custom-fields/video-option-upload.component';

// Modules
import { NgModule } from '@angular/core';
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { FlexModule } from '@angular/flex-layout/flex';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { NgxCsvParserModule } from 'ngx-csv-parser';

// Pipes
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [
    AslLexSignBankField,
    FileListField,
    SafePipe,
    VideoOptionField,
    UserVideoOption,
    VideoOptionUpload,
  ],
  imports: [
    FormsModule,
    MaterialModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    FlexModule,
    NgxCsvParserModule,
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
