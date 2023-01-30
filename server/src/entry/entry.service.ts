import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Dataset } from 'shared/dtos/dataset.dto';
import { Entry, EntryDocument } from './entry.schema';

@Injectable()
export class EntryService {
  constructor(
    @InjectModel(Entry.name)
    private entryModel: Model<EntryDocument>
  ) {}

  async find(query: FilterQuery<Entry>): Promise<Entry | null> {
    return this.entryModel.findOne(query).exec();
  }

  /**
   * Get all entries from the database
   */
  async getAllEntries(): Promise<Entry[]> {
    return this.entryModel.find({}).exec();
  }

  /**
   * Check to see if the there is already a entry with the given entryID
   *
   * @param entryID The entryID to search for
   * @return True if the entryID is present in Entries
   */
  async entryExists(entryID: string): Promise<boolean> {
    const entry = await this.entryModel.findOne({ entryID: entryID }).exec();
    return entry != null;
  }

  async createEntry(entry: Entry): Promise<Entry> {
    return this.entryModel.create(entry);
  }

  /**
   * Get all entries for the given dataset
   */
  async getEntriesForDataset(dataset: Dataset): Promise<Entry[]> {
    return this.entryModel.find({ dataset: dataset._id }).exec();
  }

  /**
   * Delete the given entry. Note this will only delete the single entry
   * and not any related entries that depend on the foreign key.
   */
  async delete(entry: Entry): Promise<void> {
    this.entryModel
      .deleteOne({
        _id: entry._id
      })
      .exec();
  }

  /**
   * Update the video URL of the given entry
   */
  async updateMediaURL(entry: Entry, mediaURL: string): Promise<void> {
    this.entryModel.updateOne({ _id: entry._id! }, { $set: { mediaURL: mediaURL } }).exec();
  }
}
