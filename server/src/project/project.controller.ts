import { Controller, Post, Body } from '@nestjs/common';
import { ProjectCreate } from 'shared/dtos/project.dto';
import { ProjectService } from './project.service';
import { Auth } from '../auth/auth.guard';
import { Project } from './project.schema';

@Controller('/api/projects')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @Post('/')
  @Auth('admin')
  async createProject(@Body() project: ProjectCreate): Promise<Project> {
    return await this.projectService.create(project);
  }
}
