// Components
import { AslLexSignBankField } from './components/custom-fields/asl-lex-field.component';
import { FileListField } from './components/custom-fields/file-list.component';
import { VideoOptionField } from './components/custom-fields/video-option-field.component';
import { UserVideoOption } from './components/custom-fields/user-video-option-field.component';
import { VideoOptionUpload } from './components/custom-fields/video-option-upload.component';
import { OneOfField } from './components/custom-fields/one-of.component';
import { StudySelectDialog } from './components/study-select-dialog.component';
import { SelectorDialog } from './components/selector-dialog.component';
import { ProjectSelectDialog } from './components/project-select-dialog.component';

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
    OneOfField,
    StudySelectDialog,
    SelectorDialog,
    ProjectSelectDialog
  ],
  imports: [
    FormsModule,
    MaterialModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    FlexModule,
    NgxCsvParserModule
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
    StudySelectDialog
  ]
})
export class SharedModule {}
