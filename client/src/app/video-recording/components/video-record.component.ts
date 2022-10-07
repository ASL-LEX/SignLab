import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

/**
 * Interface for recording a single video. The video will be stored and
 * will be available for upload.
 */
@Component({
  selector: 'video-record',
  templateUrl: './video-record.component.html',
})
export class VideoRecordComponent implements OnInit {
  @ViewChild('recordVideo') recordVideo: ElementRef;
  /** Keeps track of if the user is actively recording a video. */
  isRecording: boolean = false;
  /** The video stream from the user's webcam. */
  mediaRecorder: MediaRecorder;
  /** The blobs of the video. */
  blobs: Blob[] = [];

  constructor() {
  }

  async ngOnInit() {
  }

  toggleRecording() : void {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  async startRecording(): Promise<void> {
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
    this.mediaRecorder.ondataavailable = (event) => {
      console.log(event);
      this.blobs.push(event.data);
    };
    this.mediaRecorder.onstop = (_event) => {
      console.log(JSON.parse(JSON.stringify(this.blobs)));
      const videoBuffer = new Blob(this.blobs, {type: 'video/webm'});
      const videoUrl = URL.createObjectURL(videoBuffer);
      this.recordVideo.nativeElement.srcObject = null;
      this.recordVideo.nativeElement.src = videoUrl;
      // this.recordVideo.nativeElement.load();
    };

    this.isRecording = true;
  }

  stopRecording(): void {
    this.mediaRecorder.stop();
    this.recordVideo.nativeElement.pause();

    // Create the video buffer

    this.isRecording = false;
  }
}
