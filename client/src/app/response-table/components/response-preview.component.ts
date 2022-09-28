import {
  Component,
  OnDestroy,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ResponseTableElement } from '../models/response-table-element';

@Component({
  selector: 'response-preview',
  template: `
    <div class="video-preview">
      <video
        (mouseenter)="playVideo()"
        (mouseleave)="stopVideo()"
        (durationchange)="loadedVideoData()"
        loop
        #previewVideo
      >
        <source
          src="{{ responseElem ? responseElem.response.videoURL : '' }}"
        />
      </video>
    </div>
  `,
  styleUrls: ['./response-preview.component.css'],
})
export class ResponsePreview implements OnDestroy {
  @Input() responseElem: ResponseTableElement;
  @ViewChild('previewVideo') video: ElementRef;

  /**
   * There is a performance issue where the video elements are not cleaned up
   * by default. Thus doing things like changing page with video elements
   * will cause memory usage to grow. This explicitly clears out the
   * video.
   *
   * See
   * https://stackoverflow.com/questions/31078061/many-video-tags-on-page-in-single-page-application-angular-makes-page-frozen
   */
  ngOnDestroy(): void {
    if (!this.video) {
      return;
    }

    this.video.nativeElement.pause();
    this.video.nativeElement.src = '';
    // this.video.nativeElement.empty();
    this.video.nativeElement.load();
    this.video.nativeElement.remove();
  }

  playVideo() {
    // Get the video which was hovered over
    if (!this.video) {
      return;
    }

    // Play the video from the begining
    this.video.nativeElement.currentTime = 0;
    this.video.nativeElement.play();
  }

  stopVideo() {
    // Get the video that is no longer being hovered over
    if (!this.video) {
      return;
    }

    // Pause and reset preview
    this.video.nativeElement.pause();
    this.setToMiddleFrame();
  }

  loadedVideoData() {
    this.setToMiddleFrame();
  }

  /**
   * Have the video preview the middle frame
   */
  async setToMiddleFrame() {
    if (!this.video) {
      return;
    }

    const duration = await this.getDuration(this.video);
    if (!isFinite(duration)) {
      return;
    }

    const middleFrame = duration / 2;
    this.video.nativeElement.currentTime = middleFrame;
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
    if (isNaN(duration)) {
      return NaN;
    }

    const maxAttempts = 5;
    let attemptNum = 0;

    // If the duration is infinity, this is part of a Chrome bug that causes
    // some durations to not load for audio and video. The StackOverflow
    // link below discusses the issues and possible solutions
    if (!isFinite(duration) && attemptNum < maxAttempts) {
      // Then, wait for the update event to be triggered
      await new Promise<void>((resolve, _reject) => {
        video.nativeElement.ontimeupdate = () => {
          // Remove the callback
          video.nativeElement.ontimeupdate = () => {};
          // Reset the time
          video.nativeElement.currentTime = 0;
          resolve();
        };

        video.nativeElement.currentTime = 1e101;
      });

      // Now try to get the duration again
      duration = video.nativeElement.duration;
      attemptNum++;
    }

    // Not dealing with the bug, just returning the duration
    return duration;
  }
}
