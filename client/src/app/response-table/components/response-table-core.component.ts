import { Component, Input, Output, OnInit, EventEmitter, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResponseViewDialog } from './response-view-dialog.component';
import {
  ResponseTableElement,
  ResponseTableToggleChange,
} from '../models/response-table-element';

/**
 * The ResponseTable displays response information and controls in a tabular
 * form. This includes per-study information/control logic.
 *
 * This class provides the core view logic. The other response tables provide
 * specific options and call backs that controls how the ResponseTable is used.
 * For example, the ResponseTable can be used both when creating a study
 * as well as after the study is created.
 */
@Component({
  selector: 'response-table-core',
  templateUrl: './response-table-core.component.html',
  styleUrls: ['./response-table-core.component.css'],
})
export class ResponseTableCoreComponent implements OnInit {
  /**
   * The columns to show, these are the default options showed in every table
   * view
   *
   * TODO: Add meta data display
   */
  displayedColumns: string[] = ['view', 'responseID', 'responderID'];

  /** Determine if the study enable controls should be provided */
  @Input() displayStudyEnableControls: boolean;
  /** Determine if the training enable controls should be provided */
  @Input() displayStudyTrainingControls: boolean;
  /** The response elements to display */
  @Input() responseData: ResponseTableElement[];
  /** Emits changes to when the part of study change takes place */
  @Output() partOfStudyChange = new EventEmitter<ResponseTableToggleChange>();
  /** Emits changes to when the part of training set change takes place */
  @Output() partOfTrainingChange =
    new EventEmitter<ResponseTableToggleChange>();
  /** The different displayed videos */
  @ViewChildren('previewVideo', { read: ElementRef }) videos: QueryList<ElementRef>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Determine which additional controls should be displayed
    if (this.displayStudyTrainingControls) {
      this.displayedColumns.push('studyTrainingControls');
    }
    if (this.displayStudyEnableControls) {
      this.displayedColumns.push('studyEnableControls');
    }
  }

  /** Handles displaying the response video in a popup dialog */
  viewResponse(videoURL: string): void {
    this.dialog.open(ResponseViewDialog, {
      data: { videoURL: videoURL },
    });
  }

  /** Play the video associated with the given index */
  playVideo(index: number) {
    const video = this.videos.get(index);
    if (!video) { return; }
    video.nativeElement.currentTime = 0;
    video.nativeElement.play();
  }

  /** Stop the video */
  stopVideo(index: number) {
    const video = this.videos.get(index);
    video?.nativeElement.pause();
  }
}
