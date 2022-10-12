import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';

/**
 * Interface for recording a single video. The video will be stored and
 * will be available for upload.
 */
@Component({
  selector: 'video-record',
  templateUrl: './video-record.component.html',
  styleUrls: ['./video-record.component.css']
})
export class VideoRecordComponent implements OnInit{
  /** The view element for the video element */
  @ViewChild('recordVideo') recordVideo: ElementRef;
  /** Keeps track of if the user is actively recording a video. */
  isRecording: boolean = false;
  /** The video stream from the user's webcam. */
  mediaRecorder: MediaRecorder;
  /** The blobs of the video. */
  blobs: Blob[] = [];
  /** Output to emit completed video blob */
  @Output() videoBlob = new EventEmitter<Blob>();

  ngOnInit(): void {
    // Make a stream for the video, don't store any data
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      this.recordVideo.nativeElement.srcObject = stream;
      mediaRecorder.start();
      this.recordVideo.nativeElement.play();
    });
  }

  toggleRecording() : void {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
    this.isRecording = !this.isRecording;
  }

  private async startRecording(): Promise<void> {
    // Make a new stream, clear out original data
    this.recordVideo.nativeElement.currentTime = 0;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.recordVideo.nativeElement.srcObject = stream;
    this.blobs = [];

    // Start the recording
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.start();
    this.recordVideo.nativeElement.play();

    // Set up event listeners
    this.mediaRecorder.ondataavailable = (event) => { this.onBlobAvailable(event); };
    this.mediaRecorder.onstop = (_event) => { this.onMediaStop() };
  }

  stopRecording(): void {
    this.mediaRecorder.stop();
    this.recordVideo.nativeElement.pause();
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
    const videoBuffer = new Blob(this.blobs, {type: 'video/webm'});
    const videoUrl = URL.createObjectURL(videoBuffer);
    this.recordVideo.nativeElement.srcObject = null;
    this.recordVideo.nativeElement.src = videoUrl;

    // Emit the completed video
    this.videoBlob.emit(videoBuffer);
  }
}
