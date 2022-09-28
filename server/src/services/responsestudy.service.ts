import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Study } from '../schemas/study.schema';
import {
  ResponseStudy,
  ResponseStudyDocument,
} from '../schemas/responsestudy.schema';
import { Response } from '../schemas/response.schema';

@Injectable()
export class ResponseStudyService {
  constructor(
    @InjectModel(ResponseStudy.name)
    private responseStudyModel: Model<ResponseStudyDocument>,
  ) {}

  /**
   * Get the next ResponseStudy which is not tagged. Doing so will mark
   * it as tagged. If no ResponseStudy is left untagged, null is returned.
   *
   * @param study The study to search for an untagged response
   * @return The untagged ResponseStudy or null if no untagged responses
   *         remain
   */
  async getAndMarkTagged(study: Study): Promise<ResponseStudy | null> {
    const query = {
      study: study._id,
      isPartOfStudy: true,
      hasTag: false,
    };

    const update = {
      hasTag: true,
    };

    const responseStudy = await this.responseStudyModel
      .findOneAndUpdate(query, update)
      .populate('response')
      .populate('study')
      .exec();

    return responseStudy;
  }

  /**
   * Create a series of ResponseStudy objects for every response for a given
   * study.
   *
   * @param responses The responses to make corresponding ResposeStudies for
   * @param study The study each ResponseStudy will be associated with
   */
  async createResponseStudies(
    responses: Response[],
    study: Study,
  ): Promise<void> {
    await Promise.all(
      responses.map(async (response) => {
        await this.responseStudyModel.create({
          response: response,
          study: study,
          isPartOfStudy: true,
          isUsedForTraining: false,
          hasTag: false,
        });
      }),
    );
  }

  /**
   * Get all response studies for a given study.
   */
  async getResponseStudies(study: Study): Promise<ResponseStudy[]> {
    return this.responseStudyModel
      .find({ study: study._id })
      .populate('study')
      .populate('response')
      .exec();
  }

  /**
   * Find a response study based on a response and a study
   */
  async find(response: Response, study: Study): Promise<ResponseStudy | null> {
    return this.responseStudyModel
      .findOne({
        response: response._id,
        study: study._id,
      })
      .populate('response')
      .populate('study')
      .exec();
  }

  /**
   * Find all the Response studies related to a given response
   */
  async findMany(response: Response): Promise<ResponseStudy[]> {
    return this.responseStudyModel
      .find({ response: response._id })
      .populate('response')
      .populate('study')
      .exec();
  }

  /**
   * Change if the response is considered part of the study and should be
   * included in the tagging process.
   *
   * @param responseStudy The response study to modify
   * @param isPartOfStudy Represents if the response should be used in the
   *                      study.
   */
  async changePartOfStudy(
    responseStudy: ResponseStudy,
    isPartOfStudy: boolean,
  ): Promise<void> {
    await this.responseStudyModel
      .findOneAndUpdate(
        {
          _id: responseStudy._id,
        },
        {
          isPartOfStudy: isPartOfStudy,
        },
      )
      .exec();
  }

  /**
   * Takes in a list of Response IDs and marks the cooresponding
   * ResponseStudies as being part of the training set.
   */
  async markTraining(studyID: string, responseIDs: string[]) {
    await Promise.all(
      responseIDs.map(async (responseID) => {
        await this.markSingleTraining(studyID, responseID);
      }),
    );
  }

  /**
   * Takes in a list of Response IDs and marks the cooresponding
   * ResponseStudies as being disabled or this study.
   */
  async markDisabled(studyID: string, responseIDs: string[]) {
    await Promise.all(
      responseIDs.map(async (responseID) => {
        await this.markSingleDisabled(studyID, responseID);
      }),
    );
  }

  /**
   * Get all response studies that are identified as used for training for
   * a given study.
   */
  async getTrainingSet(study: Study): Promise<ResponseStudy[]> {
    return this.responseStudyModel
      .find({
        study: study._id!,
        isUsedForTraining: true,
      })
      .exec();
  }

  /**
   * Delete any ResponseStudy related to the given response.
   */
  async deleteResponse(response: Response) {
    this.responseStudyModel
      .deleteMany({
        response: response._id,
      })
      .exec();
  }

  /**
   * Mark a single response study as being part of the training set
   */
  private async markSingleTraining(studyID: string, responseID: string) {
    await this.responseStudyModel
      .findOneAndUpdate(
        {
          study: studyID,
          response: responseID,
        },
        {
          isUsedForTraining: true,
        },
      )
      .exec();
  }

  /**
   * Mark a single response study as being enabled/disabled
   */
  private async markSingleDisabled(studyID: string, responseID: string) {
    await this.responseStudyModel
      .findOneAndUpdate(
        {
          study: studyID,
          response: responseID,
        },
        {
          isPartOfStudy: false,
        },
      )
      .exec();
  }
}
