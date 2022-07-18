import { Component, OnInit } from '@angular/core';
import { Response } from '../../../models/response';
import { ResponseService } from '../../../services/response.service';
import { MatDialog } from '@angular/material/dialog';
import { ResponseUploadDialog } from './response-upload-dialog.component';
import {ResponseViewDialog} from './response-view-dialog.component';

/**
 * The video control view allows Admins to view all of the currently uploaded
 * videos as well as enable/disable videos from view.
 */
@Component({
  selector: 'response-control',
  templateUrl: './response-control.component.html',
  styleUrls: ['./response-control.component.css']
})
export class ResponseControlComponent implements OnInit {
  // TODO: Expose UI for what headers to show
  displayedColumns = ['view', 'isEnabled', 'responderID'];
  responseData: Response[] = [];

  constructor(private responseService: ResponseService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.responseService.getResponses()
      .then(responses => { this.responseData = responses; });
  }

  openUploadDialog() {
    this.dialog.open(ResponseUploadDialog);
  }

  viewResponse(videoURL: string) {
    this.dialog.open(ResponseViewDialog, {
      data: { videoURL: videoURL }
    });
  }
}
