import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Study } from '../study/study.schema';
import { EntryStudy, EntryStudyDocument } from './entrystudy.schema';
import { Entry } from '../entry/entry.schema';
import { Dataset } from 'shared/dtos/dataset.dto';

@Injectable()
export class EntryStudyService {
  constructor(
    @InjectModel(EntryStudy.name)
    private entryStudyModel: Model<EntryStudyDocument>
  ) {}

  /**
   * Get the next EntryStudy which is not tagged. Doing so will mark
   * it as tagged. If no EntryStudy is left untagged, null is returned.
   *
   * @param study The study to search for an untagged entry
   * @return The untagged EntryStudy or null if no untagged entries
   *         remain
   */
  async getAndMarkTagged(study: Study): Promise<EntryStudy | null> {
    const query = {
      study: study._id,
      isPartOfStudy: true,
      numberTags: { $lt: study.tagsPerEntry }
    };

    const update = {
      $inc: { numberTags: 1 }
    };

    const entryStudy = await this.entryStudyModel
      .findOneAndUpdate(query, update)
      .populate('entry')
      .populate('study')
      .exec();

    return entryStudy;
  }

  /**
   * Create a series of EntryStudy objects for every entry for a given
   * study.
   *
   * @param entries The entries to make corresponding ResposeStudies for
   * @param study The study each EntryStudy will be associated with
   * @param isPartOfStudy If the entry is part of the study
   */
  async createEntryStudies(entries: Entry[], study: Study, isPartOfStudy: boolean): Promise<void> {
    await Promise.all(
      entries.map(async (entry) => {
        await this.entryStudyModel.create({
          entry: entry,
          study: study,
          isPartOfStudy: isPartOfStudy,
          isUsedForTraining: false,
          numberTags: 0
        });
      })
    );
  }

  /**
   * Get all entry studies for a given study.
   */
  async getEntryStudies(study: Study, dataset: Dataset): Promise<EntryStudy[]> {
    const result = await this.entryStudyModel
      .aggregate([
        {
          $lookup: {
            from: 'entries',
            localField: 'entry',
            foreignField: '_id',
            as: 'entryForeign'
          }
        },
        {
          $match: {
            'entryForeign.dataset': dataset._id,
            study: study._id
          }
        }
      ])
      .exec();

    await this.entryStudyModel.populate(result, [{ path: 'entry' }, { path: 'study' }]);

    return result;
  }

  /**
   * Find a entry study based on a entry and a study
   */
  async find(entry: Entry, study: Study): Promise<EntryStudy | null> {
    return this.entryStudyModel
      .findOne({
        entry: entry._id,
        study: study._id
      })
      .populate('entry')
      .populate('study')
      .exec();
  }

  /**
   * Find all the Entry studies related to a given entry
   */
  async findMany(entry: Entry): Promise<EntryStudy[]> {
    return this.entryStudyModel.find({ entry: entry._id }).populate('entry').populate('study').exec();
  }

  /**
   * Change if the entry is considered part of the study and should be
   * included in the tagging process.
   *
   * @param entryStudy The entry study to modify
   * @param isPartOfStudy Represents if the entry should be used in the
   *                      study.
   */
  async changePartOfStudy(entryStudy: EntryStudy, isPartOfStudy: boolean): Promise<void> {
    await this.entryStudyModel
      .findOneAndUpdate(
        {
          _id: entryStudy._id
        },
        {
          isPartOfStudy: isPartOfStudy
        }
      )
      .exec();
  }

  /**
   * Takes in a list of Entry IDs and marks the cooresponding
   * EntryStudies as being part of the training set.
   */
  async markTraining(studyID: string, entryIDs: string[]) {
    await Promise.all(
      entryIDs.map(async (entryID) => {
        await this.markSingleTraining(studyID, entryID);
      })
    );
  }

  /**
   * Takes in a list of Entry IDs and marks the cooresponding
   * EntryStudies as being disabled or this study.
   */
  async markDisabled(studyID: string, entryIDs: string[]) {
    await Promise.all(
      entryIDs.map(async (entryID) => {
        await this.markSingleDisabled(studyID, entryID);
      })
    );
  }

  /**
   * Get all entry studies that are identified as used for training for
   * a given study.
   */
  async getTrainingSet(study: Study): Promise<EntryStudy[]> {
    return this.entryStudyModel
      .find({
        study: study._id!,
        isUsedForTraining: true
      })
      .exec();
  }

  /**
   * Delete any EntryStudy related to the given entry.
   */
  async deleteEntry(entry: Entry) {
    this.entryStudyModel
      .deleteMany({
        entry: entry._id
      })
      .exec();
  }

  /**
   * Mark a single entry study as being part of the training set
   */
  private async markSingleTraining(studyID: string, entryID: string) {
    await this.entryStudyModel
      .findOneAndUpdate(
        {
          study: studyID,
          entry: entryID
        },
        {
          isUsedForTraining: true
        }
      )
      .exec();
  }

  /**
   * Mark a single entry study as being enabled/disabled
   */
  private async markSingleDisabled(studyID: string, entryID: string) {
    await this.entryStudyModel
      .findOneAndUpdate(
        {
          study: studyID,
          entry: entryID
        },
        {
          isPartOfStudy: false
        }
      )
      .exec();
  }
}
