import { Injectable } from '@angular/core';
import { SignLabHttpClient } from './http.service';
import { Tag } from '../../../../../shared/dtos/tag.dto';
import { Study } from '../../../../../shared/dtos/study.dto';
import { User } from '../../graphql/graphql';

/**
 * Handles all tag related requests. This includes keeping track of the current
 * tag a user may be working on
 */
@Injectable()
export class TagService {
  /**
   * The current tag the user may be working on.
   *
   * NOTE: This is updated when `getNextUntaggedEntry` is called, so changing
   * studies and recalling that method will update this value
   */
  private currentTag: Tag | null = null;

  constructor(private signLab: SignLabHttpClient) {}

  /**
   * Get the current tag.
   *
   * If the current tag is null, will throw an error. This should only be
   * called in the context where a currentTag is expected to exist.
   */
  get current(): Tag {
    if (this.currentTag === null) {
      throw new Error('No current tag');
    }
    return this.currentTag;
  }

  /**
   * Check to see if a current tag exists
   */
  hasCurrentTag(): boolean {
    return this.currentTag !== null;
  }

  /**
   * Clear out the currently selected tag. Helpful when displaying
   * previews of a tag form.
   */
  clearCurrentTag(): void {
    this.currentTag = null;
  }

  /**
   * Get the next untgged entry for the given user and study. The return
   * value is an incompleted tag if there is another entry to tag for this
   * study, otherwise null is returned.
   */
  async getNextUntaggedEntry(user: User, study: Study, isTraining: boolean): Promise<Tag | null> {
    const query = {
      params: { userID: user._id, studyID: study._id! },
      provideToken: true
    };

    let nextTag: Tag | null = null;
    if (isTraining) {
      nextTag = await this.signLab.get<Tag | null>('api/tag/nextTraining', query);
    } else {
      nextTag = await this.signLab.get<Tag | null>('api/tag/assign', query);
    }

    this.currentTag = nextTag;

    return nextTag;
  }

  /**
   * Save the given tag.
   */
  async saveTag(tag: Tag, isTraining: boolean): Promise<void> {
    if (isTraining) {
      await this.signLab.post<any>('api/tag/completeTraining', tag, { provideToken: true });
    } else {
      await this.signLab.post<any>('api/tag/complete', tag, { provideToken: true });
    }
  }
}
