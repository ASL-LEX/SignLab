import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { ProjectAdminChange, ProjectChangePipe, ProjectCreate, ProjectAdminChangeFull } from './project.dto';
import { Project } from './project.schema';
import { ProjectService } from './project.service';
import { UserContext } from '../user/user.decorator';
import { User } from '../user/user.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ProjectPipe } from '../shared/pipes/project.pipe';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService, private readonly userService: UserService) {}

  // TODO: Add owner role guard once GraphQL role guards are supported
  @Mutation(() => Project)
  async createProject(@Args('projectCreate') projectCreate: ProjectCreate): Promise<Project> {
    return this.projectService.create(projectCreate);
  }

  @Query(() => Boolean)
  async projectExists(@Args('name') name: string): Promise<boolean> {
    return (await this.projectService.findByName(name)) !== null;
  }

  // TODO: Add project admin guard once GraphQL role guards are supported
  @Mutation(() => Boolean)
  async projectAdminChange(
    @Args('projectAdminChange', { type: () => ProjectAdminChange }, ProjectChangePipe)
    projectAdminChange: ProjectAdminChangeFull
  ): Promise<boolean> {
    await this.userService.markAsProjectAdmin(projectAdminChange);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteProject(@Args('projectID', { type: () => ID }, ProjectPipe) project: Project): Promise<boolean> {
    await this.projectService.delete(project);
    return true;
  }

  @Query(() => [Project])
  @UseGuards(JwtAuthGuard)
  async getProjects(@UserContext() user: User): Promise<Project[]> {
    return this.projectService.findByUser(user);
  }
}
