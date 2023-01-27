import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { Study } from 'shared/dtos/study.dto';
import { Tag } from 'shared/dtos/tag.dto';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'tag-view',
  template: `
    <button
      mat-stroked-button
      (click)="exportTags()"
      *ngIf="studyService.activeStudy | async as activeStudy; else loading"
    >
      Download Tag CSV
    </button>
    <ng-template #loading>No Study Selected</ng-template>
  `
})
export class TagViewComponent {
  constructor(public studyService: StudyService) {}

  exportTags() {
    this.studyService.activeStudy.pipe(take(1)).subscribe((study) => this.export(study));
  }

  private async export(activeStudy: Study | null) {
    if (!activeStudy) {
      console.error('No active study set when attempting to export a tag');
      return;
    }

    const tags = await this.studyService.getTags(activeStudy);

    // NOTE: Here is the bad, this logic should not be on the client side
    //       explicitly as such. However in the future this will be exported
    //       from a table.
    const flattenedData = tags.map((tag: Tag) => {
      return {
        entryID: tag.entry.entryID,
        mediaURL: tag.entry.mediaURL,
        study: tag.study.name,
        user: tag.user.username,
        ...tag.entry.meta,
        ...tag.info
      };
    });

    if (flattenedData.length == 0) {
      alert('No tags to export');
      return;
    }

    const headerElements = [
      'entryID',
      'mediaURL',
      'study',
      'user',
      ...Object.keys(tags[0].study.tagSchema.dataSchema.properties)
    ];

    this.downloadFile(headerElements, flattenedData, activeStudy);
  }

  downloadFile(headerElements: string[], data: any[], activeStudy: Study) {
    const replacer = (_key: string, value: any) => {
      if (value === null) {
        return '';
      }
      // For arrays, join the elements with a space
      if (Array.isArray(value)) {
        return value.join(' ');
      }
      return value;
    };

    const csv = data.map((row) =>
      headerElements.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
    );
    csv.unshift(headerElements.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = `${activeStudy.name}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
