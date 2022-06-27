import { Component } from '@angular/core';

const VIDEO_DATA = [
  {
    prompt: 'tree',
    view: 'some_url',
    duration: 3,
    isEnabled: true,
    isTagged: false
  },
  {
    prompt: 'tree',
    view: 'some_url',
    duration: 5,
    isEnabled: true,
    isTagged: true
  },
  {
    prompt: 'sand',
    view: 'some_url',
    duration: 5,
    isEnabled: true,
    isTagged: true,
  }
];

/**
 * The video control view allows Admins to view all of the currently uploaded
 * videos as well as enable/disable videos from view.
 */
@Component({
  selector: 'video-control',
  templateUrl: './video-control.component.html',
  styleUrls: ['./video-control.component.css']
})
export class VideoControlComponent {
  // TODO: Get roles dynamically from server
  displayedColumns = ['prompt', 'view', 'duration', 'isEnabled', 'isTagged'];
  videoData = VIDEO_DATA;
}
