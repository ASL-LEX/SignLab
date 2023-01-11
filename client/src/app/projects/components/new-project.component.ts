import { Component } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'new-project',
  template: `
    <mat-card>
      <mat-card-title>New Project</mat-card-title>
      <mat-card-content>
        <jsonforms
          [schema]="NEW_PROJECT_SCHEMA"
          [uischema]="NEW_PROJECT_UI_SCHEMA"
          [renderers]="renderers"
          [additionalErrors]="additionalErrors"
          (dataChange)="fieldChange($event)"
          (errors)="errorHandler($event)"
        ></jsonforms>

        <button
          mat-stroked-button
          (click)="projectSubmit()"
          [disabled]="!formValid"
        >
          Submit
        </button>
      </mat-card-content>
    </mat-card>
  `,
})
export class NewProjectComponent {
  NEW_PROJECT_SCHEMA = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
    },
    required: ['name', 'description'],
  };

  NEW_PROJECT_UI_SCHEMA = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
      },
      {
        type: 'Control',
        scope: '#/properties/description',
      },
    ],
  };

  renderers = angularMaterialRenderers;

  formValid = false;
  formData: any = {};

  additionalErrors: any[] = [];

  constructor(
    private readonly projectService: ProjectService,
    private readonly router: Router
  ) {}

  fieldChange(data: any) {
    this.formData = data;
  }

  async errorHandler(errors: any[]) {
    this.formValid = errors.length === 0;

    // If no errors from the form, then check if the project is unique
    if (this.formValid) {
      if (await this.projectService.projectExists(this.formData.name)) {
        this.additionalErrors = [
          {
            instancePath: '/name',
            message: 'Project name already exists',
            schemaPath: '',
            keyword: '',
            params: {},
          },
        ];
        this.formValid = false;
      } else {
        this.additionalErrors = [];
      }
    }
  }

  async projectSubmit(): Promise<void> {
    try {
      await this.projectService.createProject(this.formData);
      alert('Project created successfully');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.warn('Failed to make a new project');
      alert(
        'Cannot make a new project at this time, ensure you have proper permissions. If this problem persists, please contact support.'
      );
      this.formData = {};
    }
  }
}
