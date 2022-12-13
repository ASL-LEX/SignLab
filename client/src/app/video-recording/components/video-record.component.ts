import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  EventEmitter,
  Output,
  OnInit,
  Input,
} from '@angular/core';
import { VideoPreviewComponent } from './video-preview.component';

/**
 * Interface for recording a single video. The video will be stored and
 * will be available for upload.
 */
@Component({
  selector: 'video-record',
  template: `
    <div
      fxLayout="column"
      fxLayoutAlign="center center"
      class="videoContainer"
      (mouseover)="mouseOver = true"
      (mouseout)="mouseOver = false"
    >
      <!-- Circles representing the number of videos recorded -->
      <div fxLayout="row" fxLayoutAlign="space-between center">
        <div
          *ngFor="let video of videos; let i = index"
          class="circle"
          [class.selectedVideoIndicator]="i === selectedVideoIndex"
          [class.recordedIndicator]="video !== null"
        ></div>
      </div>

      <!-- Showing how many videos that have to be required, check icon if the required number of videos are required -->
      <div fxLayout="row" fxLayoutAlign="space-evenly none">
        <h3>
          Required: {{ minVideos }}
          {{ minVideos > 1 ? 'Videos' : 'Video' }} Optional: {{ maxVideos }}
        </h3>
        <mat-icon *ngIf="numVideosRecorded >= minVideos">check_circle</mat-icon>
      </div>

      <!-- Recording info message -->
      <div fxLayout="row" fxLayoutAlign="start center" class="recording-info">
        <mat-icon *ngIf="isRecording" class="recordingIndicator"
          >videocam</mat-icon
        >
        <span>{{ isRecording ? 'Recording...' : 'Preview' }}</span>
      </div>

      <!-- Video preview and navigation buttons -->
      <div
        fxLayout="row"
        fxLayoutAlign="space-between center"
        class="videoSwitcher"
      >
        <!-- Left arrow -->
        <div fxLayout="row" fxLayoutAlign="start center">
          <button mat-icon-button (click)="previousVideo()">
            <mat-icon
              class="arrow"
              [class.arrowDisabled]="selectedVideoIndex === 0 || isRecording"
              >keyboard_arrow_left</mat-icon
            >
          </button>
        </div>

        <video-preview #videoPreview (video)="saveBlob($event)"></video-preview>

        <!-- Right arrow -->
        <div fxLayout="row" fxLayoutAlign="end center">
          <button mat-icon-button (click)="nextVideo()">
            <mat-icon
              class="arrow"
              [class.arrowDisabled]="
                selectedVideoIndex === maxVideos - 1 || isRecording
              "
              >keyboard_arrow_right</mat-icon
            >
          </button>
        </div>
      </div>

      <!-- Button to start/stop recording -->
      <div>
        <button (click)="toggleRecording()" mat-stroked-button>
          {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./video-record.component.css'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)',
  },
})
export class VideoRecordComponent implements OnInit {
  /** The view element for the video element */
  @ViewChild('videoPreview') recordVideo: VideoPreviewComponent;
  /** Keeps track of if the user is actively recording a video. */
  isRecording = false;
  /** The video stream from the user's webcam. */
  mediaRecorder: MediaRecorder;
  /** The blobs of the video. */
  videos: (Blob | null)[] = [];
  /** Output to emit completed video blob */
  @Output() videoBlob = new EventEmitter<{
    videoBlob: Blob;
    videoNumber: number;
  }>();

  /** Index of the selected video being displayed */
  selectedVideoIndex = 0;
  /** The minimum number of videos the user must record */
  @Input() minVideos: number;
  /** The maximum number of videos the user can record */
  @Input() maxVideos: number;
  numVideosRecorded = 0;
  /** Used to determine if the keypresses should be considered */
  mouseOver = false;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    // Initially all the vdeo blobs are null
    this.videos = new Array(this.maxVideos).fill(null);

    // Cannot setup component until the min and max videos are set
    if (this.minVideos === undefined || this.maxVideos === undefined) {
      console.debug(
        `Min videos: ${this.minVideos}, Max videos: ${this.maxVideos}`
      );
      throw new Error('minVideos and maxVideos must be defined');
    }
  }

  toggleRecording(): void {
    if (this.isRecording) {
      this.recordVideo.stopRecording();
      this.isRecording = false;
    } else {
      this.recordVideo.startRecording().then((isSuccess: boolean) => {
        this.isRecording = isSuccess;

        // Clear out the original video blob (if any)
        this.videos[this.selectedVideoIndex] = null;

        // Force change detection to update view. The view was not detecting
        // this change automatically
        this.changeDetector.detectChanges();
      });
    }
  }

  saveBlob(blob: Blob): void {
    this.videos[this.selectedVideoIndex] = blob;
    this.numVideosRecorded = this.videos.filter(
      (video) => video !== null
    ).length;
    this.videoBlob.emit({
      videoBlob: blob,
      videoNumber: this.selectedVideoIndex,
    });
    this.changeDetector.detectChanges();
  }

  /**
   * Move to the next video as long as there is another video to move to
   * and the user is not recording
   */
  nextVideo(): void {
    if (this.selectedVideoIndex < this.maxVideos - 1 && !this.isRecording) {
      this.selectedVideoIndex++;
      this.recordVideo.setPreviewVideo(this.videos[this.selectedVideoIndex]);
    }
  }

  /**
   * Move to the previous video as long as there is another video to move to
   * and the user is not recording
   */
  previousVideo(): void {
    if (this.selectedVideoIndex > 0 && !this.isRecording) {
      this.selectedVideoIndex--;
      this.recordVideo.setPreviewVideo(this.videos[this.selectedVideoIndex]);
    }
  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.mouseOver) {
      return;
    }

    if (event.key === 'ArrowRight') {
      this.nextVideo();
    } else if (event.key === 'ArrowLeft') {
      this.previousVideo();
    } else if (event.key === ' ') {
      this.toggleRecording();
    }
  }
}
