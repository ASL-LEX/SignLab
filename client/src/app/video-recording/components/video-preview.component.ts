import {
  Component,
  ViewChild,
  Output,
  ElementRef,
  OnDestroy,
  EventEmitter,
} from '@angular/core';

/**
 * Handles the record logic for a single video. Provides a preview of the
 * video.
 */
@Component({
  selector: 'video-preview',
  template: `
    <div style="width: 100%; height: 100%;">
      <video class="video" #previewVideo class="videoView" controls></video>
    </div>
  `,
  styles: [
    '.videoView { width: 100%; height: 100%; min-width: 300px; min-height: 300px; overflow: hidden; }',
  ],
})
export class VideoPreviewComponent implements OnDestroy {
  /** The view element for the video element */
  @ViewChild('previewVideo') previewVideo: ElementRef;
  /** This component outputs a blob of the video */
  @Output() video = new EventEmitter<Blob>();
  /** The video stream from the user's webcam. */
  mediaRecorder: MediaRecorder;
  /** The blobs of the video. */
  blobs: Blob[] = [];

  constructor() {}

  /** Cleans up the video stream and removes the video element */
  ngOnDestroy(): void {
    // Clear the video stream
    this.previewVideo.nativeElement.pause();
    this.previewVideo.nativeElement.srcObject = null;
    this.previewVideo.nativeElement.src = null;
    this.previewVideo.nativeElement.load();
    this.previewVideo.nativeElement.remove();
  }

  /** Start the recording. Return true on success */
  async startRecording(): Promise<boolean> {
    // Clear the blobs
    this.blobs = [];

    // Try to get the video stream, return any issue to the user
    // TODO: Support the end user deciding if they want to use audio or
    //       not.
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
    } catch (err: any) {
      // Display the error to the user
      console.debug('Could not get user media', err);
      this.displayWebcamError(
        'Unable to access webcam, make sure you have given ' +
          'permission to access your webcam and that no other ' +
          'application is using it.'
      );

      return false;
    }

    // Setup the preview
    this.previewVideo.nativeElement.srcObject = stream;
    this.previewVideo.nativeElement.play();

    // Set the encoding
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

    // Start recording the video
    this.mediaRecorder = new MediaRecorder(stream, options);
    this.mediaRecorder.ondataavailable = (event) => {
      this.onBlobAvailable(event);
    };
    this.mediaRecorder.onstop = () => {
      this.onMediaStop();
    };
    this.mediaRecorder.start();
    return true;
  }

  /** Start the recording */
  stopRecording(): void {
    this.mediaRecorder.stop();
    this.previewVideo.nativeElement.pause();
  }

  /** Add blobs to the video */
  private onBlobAvailable(event: BlobEvent): void {
    this.blobs.push(event.data);
  }

  /**
   * Set the preview, helpful when the user is changing which video
   * to preview.
   */
  setPreviewVideo(video: Blob | null): void {
    this.displayVideo(video);
  }

  /** Save the video, display a preview of the video, and emit the URL */
  private onMediaStop(): void {
    // Gather the blobs
    const blob = new Blob(this.blobs, { type: 'video/webm' });

    this.displayVideo(blob);

    // Emit the blob
    this.video.emit(blob);
  }

  /** Make an alert for the user when an issue arises */
  private displayWebcamError(message: string): void {
    console.debug(message);
    alert(message);
  }

  /** Helper that displays the video in blob format */
  private displayVideo(blob: Blob | null): void {
    if (!blob) {
      // Clear the video
      this.previewVideo.nativeElement.src = null;
      this.previewVideo.nativeElement.load();
      return;
    }

    const url = URL.createObjectURL(blob);
    this.previewVideo.nativeElement.srcObject = null;
    this.previewVideo.nativeElement.src = url;
  }
}
