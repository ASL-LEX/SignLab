import { InputType, OmitType } from '@nestjs/graphql';
import { Project } from './project.schema';

@InputType()
export class ProjectCreate extends OmitType(Project, ['_id', 'created'] as const, InputType) {}
