import { Field, InputType, OmitType, ID } from '@nestjs/graphql';
import { User } from '../user/user.schema';
import { Project } from './project.schema';
import { ProjectPipe } from '../shared/pipes/project.pipe';
import { UserPipe } from '../shared/pipes/user.pipe';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { OrganizationService } from 'src/organization/organization.service';

@InputType()
export class ProjectCreate extends OmitType(Project, ['_id', 'created', 'organization'] as const, InputType) {
  @Field()
  organization: string;
}

/** Pipe to validate the project coming in is valid */
@Injectable()
export class ProjectCreatePipe implements PipeTransform<ProjectCreate, Promise<ProjectCreate>> {
  constructor(private readonly orgService: OrganizationService) {}

  async transform(value: ProjectCreate): Promise<ProjectCreate> {
    const org = await this.orgService.findOne(value.organization);
    if (!org) {
      throw new BadRequestException(`Organization with ID ${value.organization} does not exist`);
    }

    return value;
  }
}

/** The DTO for requesting admin change */
@InputType()
export class ProjectAdminChange {
  @Field(() => ID, { description: 'The ID of the project to update' })
  projectID: string;
  @Field(() => ID, { description: 'The ID of the user to update' })
  userID: string;
  @Field(() => Boolean, {
    description: 'Whether the user should have admin access to the project'
  })
  hasAdminAccess: boolean;
}

/** The full type with the found project and user */
export interface ProjectAdminChangeFull {
  project: Project;
  user: User;
  hasAdminAccess: boolean;
}

/** Pipe to transform a ProjectAdminChange to a ProjectAdminChangeFull */
@Injectable()
export class ProjectChangePipe implements PipeTransform<ProjectAdminChange, Promise<ProjectAdminChangeFull>> {
  constructor(private readonly projectPipe: ProjectPipe, private readonly userPipe: UserPipe) {}

  async transform(value: ProjectAdminChange) {
    const project = await this.projectPipe.transform(value.projectID);
    const user = await this.userPipe.transform(value.userID);
    return { project, user, hasAdminAccess: value.hasAdminAccess };
  }
}
