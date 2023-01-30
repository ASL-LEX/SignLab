import { Component } from '@angular/core';
import { Dataset, Project } from '../../graphql/graphql';
import { DatasetService } from '../../core/services/dataset.service';
import { ProjectService } from '../../core/services/project.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ChangeProjectAccessGQL } from '../../graphql/datasets/datasets.generated';

/**
 * View which determins which projects have the ability to access the
 * different datasets.
 */
@Component({
  selector: 'project-access',
  template: `
    <div *ngIf="datasetService.datasets | async as datasets">
      <mat-expansion-panel *ngFor="let dataset of datasets">
        <mat-expansion-panel-header>
          <mat-panel-title> {{ dataset.name }} </mat-panel-title>
          <mat-panel-description>
            {{ dataset.description }}
          </mat-panel-description>
        </mat-expansion-panel-header>

        <!-- Project View Table -->
        <div *ngIf="projectService.projects | async as projects" class="project-grid">
          <table mat-table [dataSource]="projects" class="mat-elevation-z8">
            <!-- Project Name Column -->
            <ng-container matColumnDef="projectName">
              <th mat-header-cell *matHeaderCellDef>Project Name</th>
              <td mat-cell *matCellDef="let project">{{ project.name }}</td>
            </ng-container>

            <!-- Project Description Column -->
            <ng-container matColumnDef="projectDescription">
              <th mat-header-cell *matHeaderCellDef>Project Description</th>
              <td mat-cell *matCellDef="let project">
                {{ project.description }}
              </td>
            </ng-container>

            <!-- Project Access Column -->
            <ng-container matColumnDef="projectAccess">
              <th mat-header-cell *matHeaderCellDef>Project Access to Dataset</th>
              <td mat-cell *matCellDef="let project">
                <mat-slide-toggle
                  (change)="toggleProjectAccess(dataset, project, $event)"
                  [checked]="dataset.projectAccess[project._id]"
                >
                </mat-slide-toggle></td
            ></ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </div>
      </mat-expansion-panel>
    </div>
  `,
  styleUrls: ['./project-access.component.css']
})
export class ProjectAccess {
  displayedColumns: string[] = ['projectName', 'projectDescription', 'projectAccess'];

  constructor(
    public readonly datasetService: DatasetService,
    public readonly projectService: ProjectService,
    private readonly changeProcessAccessGQL: ChangeProjectAccessGQL
  ) {}

  toggleProjectAccess(dataset: Dataset, project: Project, change: MatSlideToggleChange) {
    this.changeProcessAccessGQL
      .mutate({
        projectAccessChange: {
          datasetID: dataset.id,
          projectID: project._id,
          hasAccess: change.checked
        }
      })
      .subscribe((result) => {
        if (result.errors) {
          console.error('Failed to change process access status');
          console.error(result.errors);

          // Revert the toggle
          change.source.checked = !change.checked;
        }
      });
  }
}
