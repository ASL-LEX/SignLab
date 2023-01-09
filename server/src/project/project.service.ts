import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async create(project: Project): Promise<Project> {
    return await this.projectModel.create(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectModel.find().exec();
  }
}
