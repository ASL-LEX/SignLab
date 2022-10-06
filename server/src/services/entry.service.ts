import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entry, EntryDocument } from '../schemas/entry.schema';

@Injectable()
export class EntryService {
  constructor(
    @InjectModel(Entry.name)
    private entryModel: Model<EntryDocument>,
  ) {}

  async find(entryID: string): Promise<Entry | null> {
    return this.entryModel.findOne({ _id: entryID }).exec();
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
   * Delete the given entry. Note this will only delete the single entry
   * and not any related entries that depend on the foreign key.
   */
  async delete(entry: Entry): Promise<void> {
    this.entryModel
      .deleteOne({
        _id: entry._id,
      })
      .exec();
  }
}
