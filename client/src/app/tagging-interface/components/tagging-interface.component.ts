import { Component, OnInit } from '@angular/core';
import { ResponseService } from '../../core/services/response.service';
import { Tag } from '../../../../../shared/dtos/tag.dto';
import { MatDialog } from '@angular/material/dialog';
import { StudySelectDialog } from '../../admin-dashboard/components/studies-control/study-select-dialog.component';
import { Study } from '../../../../../shared/dtos/study.dto';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'tagging-interface',
  template: `
    <button mat-stroked-button (click)="openStudySelectDialog()">Select Study</button>

    <div *ngIf="hasRemainingTags; then tagInterface else noTagsMessage"></div>

    <!-- Tag Form -->
    <ng-template #tagInterface>
      <tagging-form
        [tag]="tag"
        (tagOutput)="formSubmit($event)"
      ></tagging-form>
    </ng-template>

    <!-- Message displayed when all tags have been complete -->
    <ng-template #noTagsMessage>
      <mat-card>
        <mat-card-title>No Responses Untagged</mat-card-title>
        <mat-card-content>
          All responses have been tagged so far, come back later
        </mat-card-content>
      </mat-card>
    </ng-template>
  `,
})
export class TaggingInterface implements OnInit {
  /** The tag to be completed */
  tag: Tag;
  /**
   * Flag that represents there are more tags to be completed. Changing it will
   * display to the user that all videos have been taged
   */
  hasRemainingTags: boolean = false;
  /** The available studies */
  studies: Study[] = [];
  /** The study the user is currently taking part in */
  activeStudy: Study | null = null;

  constructor(private responseService: ResponseService,
              private dialog: MatDialog,
              private studyService: StudyService) {}

  ngOnInit(): void {
    this.studyService.getStudies()
      .then(studies => {
        this.studies = studies;
        if (this.studies.length > 0) {
          this.activeStudy = this.studies[0];
          this.getNextTag();
        }
      });
  }

  /** Open the study select view */
  openStudySelectDialog() {
    const dialogOpenParams = {
      width: '400px',
      data: {
        studies: this.studies,
        activeStudy: this.activeStudy,
        newStudyOption: false
      }
    };

    this.dialog.open(StudySelectDialog, dialogOpenParams)
      .afterClosed()
      .subscribe((selectedStudy: any) => {
        if(selectedStudy && selectedStudy.data) {
          this.activeStudy = selectedStudy.data;
          this.getNextTag();
        }
      });
  }

  /**
   * Request the next tag to complete from the server and update the view
   * for the new tag. If no additional tag is available, set the
   * `hasRemainingTags` field which updates the view to display a message to
   * the user.
   */
  async getNextTag() {
    const tag = await this.responseService.getNextUntaggedResponse(this.activeStudy!);

    // No more tags for this study
    if (!tag) {
      this.hasRemainingTags = false;
      return;
    }

    // Update the local variables
    this.tag = tag;
    this.hasRemainingTags = true;
  }

  /**
   * Handle submitting the user tag data
   */
  async formSubmit(tag: Tag) {
    try {
      // Add on the tag data
      await this.responseService.addTag(tag);

      // Get next tag to complete
      this.getNextTag();
    } catch(error) {
      alert('Please fill out all required fields following the instructions for each field');
    }
  }
}
