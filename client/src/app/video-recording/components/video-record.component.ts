import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { VideoPreviewComponent } from './video-preview.component';

/**
 * Interface for recording a single video. The video will be stored and
 * will be available for upload.
 */
@Component({
  selector: 'video-record',
  template:
    `
    <div fxLayout="column" fxLayoutAlign="center center" class="videoContainer">
      <!-- Circles representing the number of videos recorded -->
      <div fxLayout="row" fxLayoutAlign="space-between center">
        <div *ngFor="let video of videos; let i = index"
          class="circle"
          [class.selectedVideoIndicator]="i === selectedVideoIndex"
          [class.recordedIndicator]="video !== null"
        ></div>
      </div>

      <!-- Recording info message -->
      <div fxLayout="row" fxLayoutAlign="start center" class="recording-info">
        <mat-icon *ngIf="isRecording" class="recordingIndicator">videocam</mat-icon>
        <span>{{ isRecording ? "Recording..." : "Preview" }}</span>
      </div>

      <!-- Video preview and navigation buttons -->
      <div fxLayout="row" fxLayoutAlign="space-between center" class="videoSwitcher">

        <!-- Left arrow -->
        <div fxLayout="row" fxLayoutAlign="start center">
          <button mat-icon-button (click)="previousVideo()">
            <mat-icon class="arrow" [class.arrowDisabled]="selectedVideoIndex === 0 || isRecording">keyboard_arrow_left</mat-icon>
          </button>
        </div>

        <video-preview #videoPreview (video)="saveBlob($event)"></video-preview>

        <!-- Right arrow -->
        <div fxLayout="row" fxLayoutAlign="end center">
          <button mat-icon-button (click)="nextVideo()">
            <mat-icon class="arrow" [class.arrowDisabled]="selectedVideoIndex === (numVideos - 1) || isRecording">keyboard_arrow_right</mat-icon>
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
})
export class VideoRecordComponent implements OnInit {
  /** The view element for the video element */
  @ViewChild('videoPreview') recordVideo: VideoPreviewComponent;
  /** Keeps track of if the user is actively recording a video. */
  isRecording = false;
  /** The video stream from the user's webcam. */
  mediaRecorder: MediaRecorder;
  /** The blobs of the video. */
  videos: Blob[] = [];
  /** Output to emit completed video blob */
  @Output() videoBlob = new EventEmitter<Blob>();

  /** Index of the selected video being displayed */
  selectedVideoIndex = 0;
  /** Number of videos that will be recorded */
  numVideos = 3;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    // Initially all the vdeo blobs are null
    this.videos = new Array(this.numVideos).fill(null);
  }

  toggleRecording(): void {
    if (this.isRecording) {
      this.recordVideo.stopRecording();
      this.isRecording = false;
    } else {
      this.recordVideo.startRecording().then((isSuccess: boolean) => {
        this.isRecording = isSuccess;

        // Force change detection to update view. The view was not detecting
        // this change automatically
        this.changeDetector.detectChanges();
      });
    }
  }

  saveBlob(blob: Blob): void {
    this.videos[this.selectedVideoIndex] = blob;
    this.videoBlob.emit(blob);
    this.changeDetector.detectChanges();
  }


  /**
   * Move to the next video as long as there is another video to move to
   * and the user is not recording
   */
  nextVideo(): void {
    if (this.selectedVideoIndex < this.numVideos - 1 && !this.isRecording) {
      this.selectedVideoIndex++;
    }
  }

  /**
   * Move to the previous video as long as there is another video to move to
   * and the user is not recording
   */
  previousVideo(): void {
    if (this.selectedVideoIndex > 0 && !this.isRecording) {
      this.selectedVideoIndex--;
    }
  }
}
