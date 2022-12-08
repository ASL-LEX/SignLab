import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  EventEmitter,
  Output,
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
      <!-- Recording info message -->
      <div fxLayout="row" fxLayoutAlign="start center" class="recording-info">
        <mat-icon *ngIf="isRecording" class="recordingIndicator">videocam</mat-icon>
        <span>{{ isRecording ? "Recording..." : "Preview" }}</span>
      </div>

      <video-preview #videoPreview (video)="videoBlob.emit($event)"></video-preview>

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
export class VideoRecordComponent {
  /** The view element for the video element */
  @ViewChild('videoPreview') recordVideo: VideoPreviewComponent;
  /** Keeps track of if the user is actively recording a video. */
  isRecording = false;
  /** The video stream from the user's webcam. */
  mediaRecorder: MediaRecorder;
  /** The blobs of the video. */
  blobs: Blob[] = [];
  /** Output to emit completed video blob */
  @Output() videoBlob = new EventEmitter<Blob>();

  constructor(private changeDetector: ChangeDetectorRef) {}

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
}
