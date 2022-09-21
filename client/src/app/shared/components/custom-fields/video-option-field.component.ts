import { Component, Input, Output, EventEmitter } from '@angular/core';
import { distinctUntilChanged, Subject, debounceTime } from 'rxjs';

/**
 * Defined the data which is needed to identify a possible option in the
 * video select view
 */
export interface VideoOption {
  /** The URL which can be used to display the video in an iframe */
  videoURL: string;
  /**
   * The code which is used to uniquely identify the selected video. This will
   * be used as the value in the form when the user makes their selection
   */
  code: string;
  /**
   * String which is used to search against when the user is looking for their
   * desired option. This is what the user types to find this option and what
   * will be displayed along side the video
   */
  searchTerm: string;
}

/**
 * Represents the selection made by the user. This includes if the
 * user has made a custom choice.
 */
export interface VideoSelection {
  /**
   * The value of the selection, for a custom selection, the value
   * will be what the user searched for. For a non-custom selecting, the
   * value is the code associated with the video
   */
  value: string;
  /** If the option the user selected is a custom option */
  isCustom: boolean;
};

/**
 * This component is a field where a user's option is a video they selected
 * based on some search criteria.
 *
 * This provides the core functionality for any form field where the user
 * searches for and selects a video as their option. This component needs to
 * be provided with the search information and the data to be displayed.
 */
@Component({
  selector: 'video-option-field',
  templateUrl: './video-option-field.component.html',
  styleUrls: ['./video-option-field.component.css']
})
export class VideoOptionField {
  /** The options that are to be actively displayed to the user */
  @Input() videoOptions: VideoOption[] = [];
  /** The field label which identifies the field to the user */
  @Input() label: string = '';
  /** The description explaining what the field is about to the user */
  @Input() description: string = '';
  /** Determines if a custom option is possible */
  @Input() allowCustomOption: boolean = false;
  /** Debounce between when a user has entered a search term and the value is emitted */
  @Input() debounceTime = 500;
  /** Emits an event when the user has made a selection */
  @Output() videoSelected: EventEmitter<VideoSelection> = new EventEmitter();
  /** Emits an event when the user types in a change to their search result */
  @Output() searchValue: EventEmitter<string> = new EventEmitter();
  /**
   * The selected video option, this allows for controlling which option
   * is visually shown as selected.
   *
   * -1 represents the custom option was selected
   */
  selectedIndex = 0;
  /** The current search string */
  userSearchValue = '';
  /** The search representation which is subscribed to */
  userSearchSubject = new Subject<string>();

  constructor() {
    // Listen to changes made to the search term with debounce to reduce
    // number of calls to potential filtering
    this.userSearchSubject
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe((search: string) => {
        // Emit changes to the parent
        this.searchValue.emit(search);
      });
  }

  /**
   * Handles the selection logic. Will emit the user selection and will
   * make sure the selected option is clear to the user.
   */
  makeSelection(videoOption: VideoOption, index: number): void {
    // Update the selected option
    this.selectedIndex = index;

    // Emit the selection
    this.videoSelected.emit({ value: videoOption.code, isCustom: false });
  }

  /**
   * Make a custom selection.
   */
  makeCustomSelection(): void {

    // Emit the selection
    this.videoSelected.emit({ value: '', isCustom: true });
  }
}
