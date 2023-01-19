import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from '../../core/services/project.service';
import { ProjectExistsGQL } from '../../graphql/projects/projects.generated';

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
    private readonly router: Router,
    private readonly projectExistsGQL: ProjectExistsGQL
  ) {}

  fieldChange(data: any) {
    this.formData = data;
  }

  async errorHandler(errors: any[]) {
    this.formValid = errors.length === 0;

    // If no errors from the form, then check if the project is unique
    if (this.formValid) {
      const projectExists = await firstValueFrom(
        this.projectExistsGQL.fetch({ name: this.formData.name })
      );
      if (projectExists.data.projectExists) {
        this.addProjectExistsError();
      } else {
        this.removeErrors();
      }
    }
  }

  private addProjectExistsError() {
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
  }

  private removeErrors() {
    this.additionalErrors = [];
  }

  projectSubmit(): void {
    // Attempt to make the new project
    this.projectService.createProject(this.formData).subscribe((result) => {
      if (result.errors) {
        console.debug(result.errors);
        alert(
          'Cannot make a new project at this time, ensure you have proper permissions. If this issue persists, please contact support.'
        );
      } else {
        alert('Project created successfully');
        this.formData = {};
        this.router.navigate(['/projects']);
      }
    });
  }
}
