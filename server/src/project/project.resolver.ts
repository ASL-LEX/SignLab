import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { ProjectCreate } from './project.dto';
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

  @Mutation(() => Project)
  async createProjects(createProject: ProjectCreate): Promise<Project> {
    return this.projectService.create(createProject);
  }

  @Query(() => Boolean)
  async projectExists(name: string): Promise<boolean> {
    return (await this.projectService.findByName(name)) !== null;
  }

  @Query(() => Boolean)
  async projectAdminControl(projectID: string, userID: string, hasAdminAccess: boolean): Promise<boolean> {
    const project = await this.projectService.findById(projectID);
    if (!project) {
      throw new Error('Project does not exist');
    }

    const user = await this.userService.findOne({ _id: userID });
    if (!user) {
      throw new Error('User does not exist');
    }

    try {
      await this.userService.markAsProjectAdmin(user, project, hasAdminAccess);
      return true;
    } catch (e: any) {
      throw new Error(e);
    }
  }
}
