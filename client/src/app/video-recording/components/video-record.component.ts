import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';

/**
 * Interface for recording a single video. The video will be stored and
 * will be available for upload.
 */
@Component({
  selector: 'video-record',
  templateUrl: './video-record.component.html',
  styleUrls: ['./video-record.component.css'],
})
export class VideoRecordComponent implements OnDestroy {
  /** The view element for the video element */
  @ViewChild('recordVideo') recordVideo: ElementRef;
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
      this.stopRecording();
      this.isRecording = false;
    } else {
      this.startRecording().then((isSuccess) => {
        this.isRecording = isSuccess;

        // Force change detection to update view. The view was not detecting
        // this change automatically
        this.changeDetector.detectChanges();
      });
    }
  }

  /** Start the recording, return true if successful */
  private async startRecording(): Promise<boolean> {
    // Make a new stream, clear out original data
    this.recordVideo.nativeElement.currentTime = 0;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
    } catch (err: any) {
      console.debug('Could not get user media', err);
      this.isRecording = false;

      // Let the user know that they need to enable their webcam.
      const message =
        'Unable to access webcam, make sure you have given permission' +
        'to access your webcam and that no other application is using it.';
      this.displayWebcamError(message);
      return false;
    }

    this.recordVideo.nativeElement.srcObject = stream;
    this.blobs = [];

    let options: MediaRecorderOptions = { mimeType: 'video/webm' };
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      options = { mimeType: 'video/webm; codecs=vp9' };
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      options = { mimeType: 'video/webm; codecs=vp8' };
    } else {
      console.error('Cannot instantiate mediaRecorder');
      this.displayWebcamError(
        'Unable to record video, please try again and ' +
          'report this issue if it persists.'
      );
      return false;
    }

    // Start the recording
    this.mediaRecorder = new MediaRecorder(stream, options);
    this.mediaRecorder.start();
    this.recordVideo.nativeElement.play();

    // Set up event listeners
    this.mediaRecorder.ondataavailable = (event) => {
      this.onBlobAvailable(event);
    };
    this.mediaRecorder.onstop = (_event) => {
      this.onMediaStop();
    };

    // Return success
    return true;
  }

  stopRecording(): void {
    this.mediaRecorder.stop();
    this.recordVideo.nativeElement.pause();
  }

  ngOnDestroy(): void {
    // Clear out the video element
    this.recordVideo.nativeElement.pause();
    this.recordVideo.nativeElement.src = '';
    this.recordVideo.nativeElement.load();
    this.recordVideo.nativeElement.remove();
  }

  /** Let the user know that they need to enable their webcam. */
  displayWebcamError(message: string): void {
    console.debug(message);
    alert(message);
  }

  /**
   * Handles the logic of storing produced blobs into an array
   */
  private onBlobAvailable(event: BlobEvent): void {
    this.blobs.push(event.data);
  }

  /**
   * Handles the logic of collecting the blobs, producing the
   * cooresponding video, and updating the video element to show the
   * user the recorded video.
   */
  private onMediaStop(): void {
    const videoBuffer = new Blob(this.blobs, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(videoBuffer);
    this.recordVideo.nativeElement.srcObject = null;
    this.recordVideo.nativeElement.src = videoUrl;

    // Emit the completed video
    this.videoBlob.emit(videoBuffer);
  }
}
