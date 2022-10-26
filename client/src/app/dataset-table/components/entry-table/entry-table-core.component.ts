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
  EntryTableElement,
  EntryTableToggleChange,
} from '../../models/entry-table-element';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

/**
 * The EntryTable displays entry information and controls in a tabular
 * form. This includes per-study information/control logic.
 *
 * This class provides the core view logic. The other entry tables provide
 * specific options and call backs that controls how the EntryTable is used.
 * For example, the EntryTable can be used both when creating a study
 * as well as after the study is created.
 */
@Component({
  selector: 'entry-table-core',
  templateUrl: './entry-table-core.component.html',
  styleUrls: ['./entry-table-core.component.css'],
})
export class EntryTableCoreComponent
  implements OnInit, AfterViewInit, OnChanges
{
  /**
   * The columns to show, these are the default options showed in every table
   * view
   *
   * TODO: Add meta data display
   */
  displayedColumns: string[] = ['view', 'entryID', 'responderID'];

  /** Determine if the study enable controls should be provided */
  @Input() displayStudyEnableControls: boolean;
  /** Determine if the training enable controls should be provided */
  @Input() displayStudyTrainingControls: boolean;
  /** Determine if the deletion option should be displayed */
  @Input() displayDeletion = false;
  /** The entry elements to display */
  @Input() entryData: EntryTableElement[];
  /** Emits changes to when the part of study change takes place */
  @Output() partOfStudyChange = new EventEmitter<EntryTableToggleChange>();
  /** Emits changes to when the part of training set change takes place */
  @Output() partOfTrainingChange = new EventEmitter<EntryTableToggleChange>();
  /** Emits change when the user requests a deletion */
  @Output() deleteEntry = new EventEmitter<EntryTableElement>();
  /** Controls the page based access */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** The paged data */
  dataSource: MatTableDataSource<EntryTableElement>;

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
      this.displayedColumns.push('deleteEntry');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entryData) {
      this.dataSource.data = changes.entryData.currentValue;
    }
  }

  handleDeletion(entryElem: EntryTableElement) {
    this.deleteEntry.emit(entryElem);
  }
}
