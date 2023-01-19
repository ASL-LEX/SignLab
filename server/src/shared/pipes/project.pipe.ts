import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Project } from '../../project/project.schema';
import { ProjectService } from '../../project/project.service';

@Injectable()
export class ProjectPipe implements PipeTransform<string, Promise<Project>> {
  constructor(private readonly projectService: ProjectService) {}

  async transform(value: string): Promise<Project> {
    try {
      const project = await this.projectService.findById(value);
      if (project) {
        return project;
      }
    } catch(e: any) {}

    throw new BadRequestException(`Could not find project with id ${value}`);
  }
}
