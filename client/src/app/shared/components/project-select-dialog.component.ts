import { Component } from '@angular/core';
import { Project } from 'shared/dtos/project.dto';
import { SelectDialogOptions } from './selector-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../core/services/project.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'project-select-dialog',
  template: `
    <selector-dialog
      [header]="'Project Select'"
      [options]="projectOptions"
      [(selected)]="activeProjectID"
      (selectedChange)="changeProject($event)"
    ></selector-dialog>
  `,
})
export class ProjectSelectDialog {
  /** The options the user can select from */
  projectOptions: SelectDialogOptions[];
  /** The projects themselves, searched through via ID */
  projects: Project[];
  /** The active project ID, for rendering to the user the current selection */
  activeProjectID = '';

  constructor(
    private dialogRef: MatDialogRef<ProjectSelectDialog>,
    private projectService: ProjectService
  ) {
    // Generate the project list
    firstValueFrom(this.projectService.projects).then((projects) => {
      this.updateProjectOptions(projects);
    });

    // Determine the current active project
    firstValueFrom(this.projectService.activeProject).then((project) => {
      this.activeProjectID = project ? project._id! : '';
    });
  }

  changeProject(projectOption: SelectDialogOptions) {
    const project = this.projects.find((project) => project._id! === projectOption.value);
    if (!project) {
      throw new Error('Project not found');
    }

    this.projectService.setActiveProject(project);
    this.dialogRef.close({ data: project });
  }

  updateProjectOptions(projects: Project[]) {
    this.projects = projects;
    this.projectOptions = projects.map((project) => {
      return {
        name: project.name,
        value: project._id!,
      }
    });
  }
}
