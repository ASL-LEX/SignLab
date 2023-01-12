import { Controller, Post, Body, Get, Param, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ProjectCreate } from 'shared/dtos/project.dto';
import { ProjectService } from './project.service';
import { Project } from './project.schema';
import { UserService } from '../user/user.service';

@Controller('/api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService, private readonly userService: UserService) {}

  @Get('/')
  async getProjects(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Post('/')
  async createProject(@Body() project: ProjectCreate): Promise<Project> {
    return await this.projectService.create(project);
  }

  @Get('/exists/:name')
  async projectExists(@Param('name') name: string): Promise<boolean> {
    return (await this.projectService.findByName(name)) != null;
  }

  /**
   * TODO: Add guard for project admin
   */
  @Put('/user/enable')
  async controlAdminAccess(@Body() changeRequest: { projectID: string; userID: string; hasAdminAccess: boolean }): Promise<void> {
    // Get the correct project
    const project = await this.projectService.findById(changeRequest.projectID);
    if (!project) {
      throw new HttpException(`Project with ID ${changeRequest.projectID} not found`, HttpStatus.BAD_REQUEST);
    }

    // Find the user
    const user = await this.userService.findOne({ _id: changeRequest.userID });
    if (!user) {
      throw new HttpException(`User with ID ${changeRequest.userID} not found`, HttpStatus.BAD_REQUEST);
    }

    return this.userService.markAsProjectAdmin(user, project, changeRequest.hasAdminAccess);
  }
}
