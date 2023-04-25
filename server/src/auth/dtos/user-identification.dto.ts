import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UserIdentification {
  @Field()
  username: string;

  @Field(() => ID)
  organization: string;

  @Field()
  email: string;
}
