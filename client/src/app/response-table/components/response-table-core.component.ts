import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ResponseTableElement,
  ResponseTableToggleChange,
} from '../models/response-table-element';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

/**
 * The ResponseTable displays response information and controls in a tabular
 * form. This includes per-study information/control logic.
 *
 * This class provides the core view logic. The other response tables provide
 * specific options and call backs that controls how the ResponseTable is used.
 * For example, the ResponseTable can be used both when creating a study
 * as well as after the study is created.
 */
@Component({
  selector: 'response-table-core',
  templateUrl: './response-table-core.component.html',
  styleUrls: ['./response-table-core.component.css'],
})
export class ResponseTableCoreComponent implements OnInit, AfterViewInit, OnChanges {
  /**
   * The columns to show, these are the default options showed in every table
   * view
   *
   * TODO: Add meta data display
   */
  displayedColumns: string[] = ['view', 'responseID', 'responderID'];

  /** Determine if the study enable controls should be provided */
  @Input() displayStudyEnableControls: boolean;
  /** Determine if the training enable controls should be provided */
  @Input() displayStudyTrainingControls: boolean;
  /** Determine if the deletion option should be displayed */
  @Input() displayDeletion: boolean = false;
  /** The response elements to display */
  @Input() responseData: ResponseTableElement[];
  /** Emits changes to when the part of study change takes place */
  @Output() partOfStudyChange = new EventEmitter<ResponseTableToggleChange>();
  /** Emits changes to when the part of training set change takes place */
  @Output() partOfTrainingChange = new EventEmitter<ResponseTableToggleChange>();
  /** Emits change when the user requests a deletion */
  @Output() deleteResponse = new EventEmitter<ResponseTableElement>();
  /** Controls the page based access */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** The paged data */
  dataSource: MatTableDataSource<ResponseTableElement>;

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    // Determine which additional controls should be displayed
    if (this.displayStudyTrainingControls) {
      this.displayedColumns.push('studyTrainingControls');
    }
    if (this.displayStudyEnableControls) {
      this.displayedColumns.push('studyEnableControls');
    }
    if (this.displayDeletion) {
      this.displayedColumns.push('deleteResponse');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.responseData) {
      this.dataSource.data = changes.responseData.currentValue;
    }
  }

  handleDeletion(responseElem: ResponseTableElement) {
    this.deleteResponse.emit(responseElem);
  }
}
