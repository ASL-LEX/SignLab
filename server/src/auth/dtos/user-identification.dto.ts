import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserIdentification {
  @Field()
  username: string;

  @Field()
  email: string;
}
