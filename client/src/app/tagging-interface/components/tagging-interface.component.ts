import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Tag } from 'shared/dtos/tag.dto';
import { Study } from 'shared/dtos/study.dto';
import { AuthService } from '../../core/services/auth.service';
import { TagService } from '../../core/services/tag.service';

@Component({
  selector: 'tagging-interface',
  template: `
    <div *ngIf="hasRemainingTags; then tagInterface; else noTagsMessage"></div>

    <!-- Tag Form -->
    <ng-template #tagInterface>
      <tagging-form [tag]="tag" (tagOutput)="formSubmit($event)"></tagging-form>
    </ng-template>

    <!-- Message displayed when all tags have been complete -->
    <ng-template #noTagsMessage>
      <mat-card>
        <mat-card-title>No Entries Untagged</mat-card-title>
        <mat-card-content>
          <!-- Training "no more tags" message -->
          <div *ngIf="isTraining">
            Training complete, notify your admin for further access to the study
          </div>

          <!-- Normal tagging "no more tags" message -->
          <div *ngIf="!isTraining">
            All entries have been tagged so far, come back later
          </div>
        </mat-card-content>
      </mat-card>
    </ng-template>
  `,
})
export class TaggingInterface implements OnChanges, OnInit {
  /** The tag to be completed */
  tag: Tag;
  /**
   * Flag that represents there are more tags to be completed. Changing it will
   * display to the user that all videos have been taged
   */
  hasRemainingTags = false;
  /** The current study that tagging is taking place for */
  @Input() study: Study;
  /** Flag that determines if the tagging is being done or training or not */
  @Input() isTraining = false;

  constructor(
    private authService: AuthService,
    private tagService: TagService,
  ) {}

  ngOnInit(): void {
    this.getNextTag();
  }

  /** Handle changes made to the input */
  ngOnChanges(changes: SimpleChanges) {
    // Changes to study
    if (changes.study) {
      this.study = changes.study.currentValue;
    }

    // Changes to isTraining
    if (changes.isTraining) {
      this.isTraining = changes.isTraining.currentValue;
    }

    // Update the current tag shown
    this.getNextTag();
  }

  /**
   * Request the next tag to complete from the server and update the view
   * for the new tag. If no additional tag is available, set the
   * `hasRemainingTags` field which updates the view to display a message to
   * the user.
   */
  async getNextTag() {
    const tag = await this.tagService.getNextUntaggedEntry(
      this.authService.user,
      this.study,
      this.isTraining
    );

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
      await this.tagService.saveTag(tag, this.isTraining);

      // Get next tag to complete
      this.getNextTag();
    } catch (error) {
      alert(
        'Please fill out all required fields following the instructions for each field'
      );
    }
  }
}
