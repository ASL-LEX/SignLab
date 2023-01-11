import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProjectCreate } from 'shared/dtos/project.dto';
import { ProjectService } from './project.service';
import { Project } from './project.schema';

@Controller('/api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
}
