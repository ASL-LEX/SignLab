import { Field, InputType, OmitType, ID } from '@nestjs/graphql';
import { Project } from './project.schema';

@InputType()
export class ProjectCreate extends OmitType(Project, ['_id', 'created'] as const, InputType) {}

@InputType()
export class ProjectAdminChange {
  @Field(() => ID, { description: 'The ID of the project to update' })
  projectID: string;
  @Field(() => ID, { description: 'The ID of the user to update' })
  userID: string;
  @Field(() => Boolean, { description: 'Whether the user should have admin access to the project' })
  hasAdminAccess: boolean;
}
