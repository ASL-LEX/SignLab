import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserAvailability {
  @Field()
  username: boolean;

  @Field()
  email: boolean;
}
