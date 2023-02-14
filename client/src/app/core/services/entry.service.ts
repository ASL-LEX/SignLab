import { Injectable } from '@angular/core';
import { SaveAttempt, Entry } from 'shared/dtos/entry.dto';
import { EntryStudy } from 'shared/dtos/entrystudy.dto';
import { SignLabHttpClient } from './http.service';
import { MetadataDefinition } from 'shared/dtos/entry.dto';
import { Study } from 'shared/dtos/study.dto';
import { Dataset, User } from '../../graphql/graphql';

/**
 * Handle access and modifications make to entries.
 */
@Injectable()
export class EntryService {
  constructor(private signLab: SignLabHttpClient) {}

  /**
   * Set the metadata that all entries will be expected to have.
   */
  async setMetadata(definitions: MetadataDefinition[]) {
    this.signLab.post<any>('api/entry/metadata', definitions, {
      provideToken: true
    });
  }

  /**
   * Get all entries.
   *
   * @return List of entries
   */
  async getEntries(): Promise<Entry[]> {
    return this.signLab.get<Entry[]>('api/entry/', {
      provideToken: true
    });
  }

  /**
   * Get all entries for the given dataset
   */
  async getEntriesForDataset(dataset: Dataset): Promise<Entry[]> {
    return this.signLab.get<Entry[]>(`api/entry/dataset/${dataset.id}`, {
      provideToken: true
    });
  }

  /**
   * Get all entries with the cooresponding information about how the
   * entry is used in a study.
   */
  async getEntryStudies(study: Study, dataset: Dataset): Promise<EntryStudy[]> {
    return this.signLab.get<EntryStudy[]>('api/entry/entriestudies', {
      params: { studyID: study._id!, datasetID: dataset.id },
      provideToken: true
    });
  }

  /**
   * Set the dataset that the user is uploading entries for.
   */
  async setTargetDataset(dataset: Dataset) {
    this.signLab.put(`api/entry/upload/dataset/${dataset.id}`, null, {
      provideToken: true
    });
  }

  /**
   * Set the target user for the entry upload
   */
  async setTargetUser(user: User) {
    this.signLab.put<any>(`api/entry/upload/user/${user._id}`, null, {
      provideToken: true
    });
  }

  /**
   * Upload the CSV that containes information on new entries
   *
   * @param file The file to upload
   */
  async uploadCSV(file: File): Promise<SaveAttempt> {
    // Make the post form
    const form = new FormData();
    form.append('file', file);

    return this.signLab.post<SaveAttempt>('api/entry/upload/csv', form, {
      provideToken: true
    });
  }

  /**
   * Upload ZIP which has all of the new entry videos in it
   */
  async uploadZIP(file: File): Promise<SaveAttempt> {
    const form = new FormData();
    form.append('file', file);

    return this.signLab.post<SaveAttempt>('api/entry/upload/zip', form, {
      provideToken: true
    });
  }

  /**
   * Change the enable state of a entry for given study.
   *
   * @param entryID The entry to change th    const params = e enable state of
   * @param usedInStudy If the entry should be included in the tagging
   *                    portion of the study or not
   * @param studyID The ID of the study that this is being applied to
   * @return True if the change took place successfully
   */
  async setUsedInStudy(entryID: string, usedInStudy: boolean, studyID: string): Promise<boolean> {
    const targetURL = 'api/entry/enable';
    const requestBody = {
      entryID: entryID,
      studyID: studyID,
      isPartOfStudy: usedInStudy
    };
    try {
      await this.signLab.put<any>(targetURL, requestBody, { provideToken: true });
    } catch (error) {
      console.debug('Failed to update the user role');
      return false;
    }
    return true;
  }

  /**
   * Delete the given entry
   *
   * @param entry The entry to delete
   */
  async delete(entry: Entry) {
    this.signLab.delete<any>(`api/entry/${entry._id}`, {
      provideToken: true
    });
  }

  /**
   * Get the header which is the required fields to be present in a CSV
   * upload of entry data
   */
  async getCSVHeader(): Promise<string> {
    const result = await this.signLab.get<{ header: string }>('api/entry/template', { provideToken: true });

    return result.header;
  }
}
