import { Component, Inject } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from '../../graphql/graphql';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.css']
})
export class ProjectTable {
  displayedColumns = ['name', 'description', 'delete'];

  constructor(public readonly projectService: ProjectService, private readonly dialog: MatDialog) {}

  handleDeletion(project: Project) {
    const ref = this.dialog.open(ConfirmationDialog, {
      width: '800px',
      data: project
    });

    ref.afterClosed().subscribe(async (shouldDelete) => {
      if (shouldDelete) {
        await firstValueFrom(this.projectService.deleteProject(project));
        this.projectService.updateProjectList();
      }
    });
  }
}

@Component({
  selector: 'delete-study-dialog',
  template: `
    <h1 mat-dialog-title>Delete: {{ project.name }}</h1>
    <div mat-dialog-content>
      Deleting a project will also delete all contained studies. Deleting a study will remove all cooresponding tags and
      remove the relation between entries recorded as part of the study and the source tag. Entries recorded as part of
      this study will not be deleted. Are you sure you want to delete the study?
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button [mat-dialog-close]="true" cdkFocusInitial>Yes Delete</button>
    </div>
  `
})
export class ConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public project: Project) {}
}
