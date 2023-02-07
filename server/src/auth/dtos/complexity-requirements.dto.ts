import { ObjectType, Field } from '@nestjs/graphql';
import { ComplexityOptions } from 'joi-password-complexity';

@ObjectType()
export class PasswordComplexity implements ComplexityOptions {
  @Field({ nullable: true })
  min?: number;

  @Field({ nullable: true })
  max?: number;

  @Field({ nullable: true })
  lowerCase?: number;

  @Field({ nullable: true })
  upperCase?: number;

  @Field({ nullable: true })
  numeric?: number;

  @Field({ nullable: true })
  symbol?: number;

  @Field({ nullable: true })
  requirementCount?: number;
}
