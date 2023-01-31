import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';
import { ProjectCreate } from './project.dto';
import { User } from '../user/user.schema';
import { StudyService } from '../study/study.service';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
              private readonly studyService: StudyService) {}

  async create(project: ProjectCreate): Promise<Project> {
    const newProject: ProjectCreate & { created: Date } = {
      ...project,
      created: new Date()
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

  /**
   * Get projects that a user can view. Projects that meet the following
   * criteria are visible.
   *
   * 1. If the user is the owner, all project are visible
   * 2. If the user is an admin for a project, that project is visible
   * 3. If the user is an admin for a study, that project is visible
   * 4. If the user has a study visible, the project is visible
   */
  async findByUser(user: User): Promise<Project[]> {
    // Owner can see everything
    if (user.roles.owner) {
      return this.findAll();
    }

    // Get the IDs of projects the user is an admin of
    const visibleIDs = Object.keys(user.roles.projectAdmin).filter((id) => user.roles.projectAdmin[id]);

    // Get the IDs of projects the user is an admin of a study in
    // Requires querying the study to determing the corresponding project
    const studyAdmin = await Promise.all(Object.keys(user.roles.studyAdmin)
                                               .filter((id) => user.roles.studyAdmin[id])
                                               .map(async (id) => (await this.studyService.find(id))!.project));

    // Get the IDs of studies that are visible to the user
    const studyVisible = await Promise.all(Object.keys(user.roles.studyVisible)
                                                 .filter((id) => user.roles.studyVisible[id])
                                                 .map(async (id) => (await this.studyService.find(id))!.project));

    // Combine all the IDs
    const allIDs = [...visibleIDs, ...studyAdmin, ...studyVisible];

    // Remove duplicates
    const uniqueIDs = [...new Set(allIDs)];

    return this.projectModel.find({ _id: { $in: uniqueIDs } }).exec();
  }
}
