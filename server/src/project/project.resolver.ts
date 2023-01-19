import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { ProjectAdminChange, ProjectCreate } from './project.dto';
import { Project } from './project.schema';
import { ProjectService } from './project.service';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService,
              private readonly userService: UserService) {}

  @Query(() => [Project])
  getProjects(): Promise<Project[]> {
    console.log('called');
    return this.projectService.findAll();
  }

  @Mutation(() => Project)
  async createProject(@Args('projectCreate') projectCreate: ProjectCreate): Promise<Project> {
    return this.projectService.create(projectCreate);
  }

  @Query(() => Boolean)
  async projectExists(@Args('name') name: string): Promise<boolean> {
    return (await this.projectService.findByName(name)) !== null;
  }

  @Mutation(() => Boolean)
  async projectAdminChange(@Args('projectAdminChange') projectAdminChange: ProjectAdminChange): Promise<boolean> {
    const project = await this.projectService.findById(projectAdminChange.projectID);
    if (!project) {
      throw new Error('Project does not exist');
    }

    const user = await this.userService.findOne({ _id: projectAdminChange.userID });
    if (!user) {
      throw new Error('User does not exist');
    }

    try {
      await this.userService.markAsProjectAdmin(user, project, projectAdminChange.hasAdminAccess);
      return true;
    } catch (e: any) {
      throw new Error(e);
    }
  }
}
