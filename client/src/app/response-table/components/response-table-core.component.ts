import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResponseViewDialog } from './response-view-dialog.component';
import {
  ResponseTableElement,
  ResponseTableToggleChange,
} from '../models/response-table-element';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

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
export class ResponseTableCoreComponent implements OnInit, AfterViewInit, OnChanges {
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
  /** Controls the page based access */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** The paged data */
  dataSource: MatTableDataSource<ResponseTableElement>;

  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    // Determine which additional controls should be displayed
    if (this.displayStudyTrainingControls) {
      this.displayedColumns.push('studyTrainingControls');
    }
    if (this.displayStudyEnableControls) {
      this.displayedColumns.push('studyEnableControls');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.responseData) {
      this.dataSource.data = changes.responseData.currentValue;
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
    // Get the video which was hovered over
    const video = this.videos.get(index);
    if (!video) { return; }

    // Play the video from the begining
    video.nativeElement.curentTime = 0;
    video.nativeElement.play();
  }

  /** Stop the video */
  stopVideo(index: number) {
    // Get the video that is no longer being hovered over
    const video = this.videos.get(index);
    if (!video) { return; }

    // Pause and reset preview
    video.nativeElement.pause();
    this.setToMiddleFrame(index);
  }

  metadataLoaded(index: number) {
    this.setToMiddleFrame(index);
  }

  /**
   * Set the video at the given index in `this.videos` to play at the
   * given location.
   */
  async setToMiddleFrame(videoIdx: number) {
    const video = this.videos.get(videoIdx);
    if (!video) { return; }

    const duration = await this.getDuration(video);

    const middleFrame = duration / 2;
    video.nativeElement.currentTime = middleFrame;
  }

  /**
   * This function provides a wrapper around access the duration of a video.
   * The wrapper handles dealing with a bug in Chrome where certain videos
   * don't provide a value duration.
   *
   * Links are provided below which explain the issue and the work around.
   *
   * https://stackoverflow.com/questions/21522036/html-audio-tag-duration-always-infinity
   * https://www.thecodehubs.com/infinity-audio-video-duration-issue-fixed-using-javascript/
   */
  private async getDuration(video: ElementRef): Promise<number> {
    // Get the duration and simply return if the duration is NaN
    let duration = video.nativeElement.duration;
    if (isNaN(duration)) { return NaN; }

    // If the duration is infinity, this is part of a Chrome bug that causes
    // some durations to not load for audio and video. The StackOverflow
    // link below discusses the issues and possible solutions
    if (duration == Infinity) {
      // First, set the current time to a large number
      video.nativeElement.currentTime = 1e101;

      // Then, wait for the update event to be triggered
      await new Promise<void>((resolve, _reject) => {
        video.nativeElement.ontimeupdate = () => {
          // Remove the callback
          video.nativeElement.ontimeupdate = () => {};
          // Reset the time
          video.nativeElement.currentTime = 0;
          resolve();
        };
      });

      // Now try to get the duration again
      return video.nativeElement.duration;
    }

    // Not dealing with the bug, just returning the duration
   return duration;
  }
}
