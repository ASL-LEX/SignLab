import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectCreate } from 'shared/dtos/project.dto';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(project: ProjectCreate): Promise<Project> {
    const newProject: ProjectCreate & { created: Date } = {
      ...project,
      created: new Date(),
    };
    return await this.projectModel.create(newProject);
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findByName(name: string): Promise<Project | null> {
    return this.projectModel.findOne({ name: name }).exec();
  }

  async findById(id: string): Promise<Project | null> {
    return this.projectModel.findById(id);
  }
}
