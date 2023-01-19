import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { ProjectAdminChange, ProjectChangePipe, ProjectCreate, ProjectAdminChangeFull } from './project.dto';
import { Project } from './project.schema';
import { ProjectService } from './project.service';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService,
              private readonly userService: UserService) {}

  @Query(() => [Project])
  getProjects(): Promise<Project[]> {
    return this.projectService.findAll();
  }

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
  async projectAdminChange(@Args('projectAdminChange', { type: () => ProjectAdminChange }, ProjectChangePipe) projectAdminChange: ProjectAdminChangeFull): Promise<boolean> {
    await this.userService.markAsProjectAdmin(projectAdminChange);
    return true;
  }
}
