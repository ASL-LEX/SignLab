import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserSignup {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}
