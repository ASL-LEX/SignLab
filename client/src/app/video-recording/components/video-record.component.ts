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

  constructor() {
  }

  async ngOnInit() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    this.recordVideo.nativeElement.srcObject = stream;
  }
}
