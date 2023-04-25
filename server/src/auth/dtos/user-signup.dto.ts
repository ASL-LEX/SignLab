import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UserSignup {
  @Field()
  username: string;

  @Field(() => ID)
  organization: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}
