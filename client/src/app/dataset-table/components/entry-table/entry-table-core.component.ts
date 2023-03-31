import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { EntryTableElement, EntryTableToggleChange } from '../../models/entry-table-element';
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
  styleUrls: ['./entry-table-core.component.css']
})
export class EntryTableCoreComponent implements OnInit, AfterViewInit, OnChanges {
  /**
   * The columns to show, these are the default options showed in every table
   * view
   *
   * TODO: Add meta data display
   */
  possibleColumns: { name: string; visible: boolean }[] = [
    { name: 'Video Preview', visible: true },
    { name: 'Entry ID', visible: true },
    { name: 'Responder ID', visible: true }
  ];
  displayedColumns: string[] = [];

  /** Determine if the study enable controls should be provided */
  @Input() displayStudyEnableControls: boolean;
  /** Determine if the training enable controls should be provided */
  @Input() displayStudyTrainingControls: boolean;
  /** Determine if the deletion option should be displayed */
  @Input() displayDeletion = false;
  /** The entry elements to display */
  @Input() entryData: EntryTableElement[];
  /** Column for selecting entries */
  @Input() displaySelect = false;
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
      this.possibleColumns.push({ name: 'Training Control', visible: true });
    }
    if (this.displayStudyEnableControls) {
      this.possibleColumns.push({ name: 'Study Enable', visible: true });
    }
    if (this.displayDeletion) {
      this.possibleColumns.push({ name: 'Delete Entry', visible: true });
    }
    if (this.displaySelect) {
      this.possibleColumns.unshift({ name: 'Select', visible: true });
    }
    this.updateColumns();
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

  updateColumns() {
    this.displayedColumns = this.possibleColumns.filter((column) => column.visible).map((column) => column.name);
  }
}
