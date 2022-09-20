import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, ResponseDocument } from '../schemas/response.schema';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name)
    private responseModel: Model<ResponseDocument>,
  ) {}

  async find(responseID: string): Promise<Response | null> {
    return this.responseModel.findOne({ _id: responseID }).exec();
  }

  /**
   * Get all responses from the database
   */
  async getAllResponses(): Promise<Response[]> {
    return this.responseModel.find({}).exec();
  }

  /**
   * Check to see if the there is already a response with the given responseID
   *
   * @param responseID The responseID to search for
   * @return True if the responseID is present in Responses
   */
  async responseExists(responseID: string): Promise<boolean> {
    const response = await this.responseModel
      .findOne({ responseID: responseID })
      .exec();
    return response != null;
  }

  async createResponse(response: Response): Promise<Response> {
    return this.responseModel.create(response);
  }

  /**
   * Delete the given response. Note this will only delete the single entry
   * and not any related entries that depend on the foreign key.
   */
  async delete(response: Response): Promise<void> {
    this.responseModel.deleteOne({
      _id: response._id
    }).exec();
  }
}
