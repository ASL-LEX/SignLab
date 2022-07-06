import { Component } from '@angular/core';

const VIDEO_DATA = [
  {
    prompt: 'tree',
    view: 'some_url',
    duration: 3,
    isEnabled: true,
    responderID: 'bob',
    tag: '',
  },
  {
    prompt: 'tree',
    view: 'some_url',
    duration: 5,
    isEnabled: true,
    isTagged: true,
    responderID: 'sam',
    tag: 'bark',
    tagger: 'mary'
  },
  {
    prompt: 'sand',
    view: 'some_url',
    duration: 5,
    isEnabled: true,
    isTagged: true,
    responderID: 'matt',
    tag: 'desert',
    tagger: 'brian'
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
  // TODO: Expose UI for what headers to show
  displayedColumns = ['prompt', 'view', 'tag', 'duration', 'isEnabled', 'isTagged',
                      'responderID', 'tagger'];
  videoData = VIDEO_DATA;
}
