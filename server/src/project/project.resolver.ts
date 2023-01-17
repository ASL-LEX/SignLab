import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class ProjectResolver {
  @Query(() => String)
  hello() {
    return 'Hello World!';
  }
}
