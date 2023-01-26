import { Field, ID, InputType, OmitType } from '@nestjs/graphql';
import { Dataset } from './dataset.schema';
import { UserPipe } from '../shared/pipes/user.pipe';
import { Injectable, PipeTransform } from '@nestjs/common';

/** DTO that the user provides when creating a new dataset */
@InputType()
export class DatasetCreate extends OmitType(
  Dataset,
  ['_id', 'creator', 'projectAccess'] as const,
  InputType,
) {
  @Field(() => ID, {
    description: 'The ID of the user who is creating the dataset',
  })
  creatorID: string;
}

/** Represents the dataset create object with the populated user field */
export type DatasetCreateFull = Omit<Dataset, '_id'>;

/** Pipe to convert the DatasetCreate to DatasetCreateFull */
@Injectable()
export class DatasetCreatePipe
  implements PipeTransform<DatasetCreate, Promise<DatasetCreateFull>>
{
  constructor(private readonly userPipe: UserPipe) {}

  async transform(value: DatasetCreate): Promise<DatasetCreateFull> {
    const creator = await this.userPipe.transform(value.creatorID);
    return { ...value, creator, projectAccess: {} };
  }
}
