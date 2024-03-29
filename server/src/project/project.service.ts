import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';
import { ProjectCreate } from './project.dto';
import { User } from '../user/user.schema';
import { StudyService } from '../study/study.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly studyService: StudyService,
    private readonly userService: UserService
  ) {}

  async create(project: ProjectCreate, organization: string): Promise<Project> {
    const newProject = {
      ...project,
      organization: organization,
      created: new Date()
    };
    return await this.projectModel.create(newProject);
  }

  async findAll(organization: string): Promise<Project[]> {
    return this.projectModel.find({ organization }).exec();
  }

  async findByName(name: string, organization: string): Promise<Project | null> {
    return this.projectModel.findOne({ name, organization }).exec();
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
      return this.findAll(user.organization);
    }

    // Get the IDs of projects the user is an admin of
    const projectAdminIDs = [];
    for (const [id, isAdmin] of user.roles.projectAdmin) {
      if (isAdmin) {
        projectAdminIDs.push(id);
      }
    }

    // Get the IDs of projects the user is an admin of a study in
    // Requires querying the study to determing the corresponding project
    const studyAdminIDs = [];
    for (const [id, isAdmin] of user.roles.studyAdmin) {
      if (isAdmin) {
        const study = await this.studyService.find(id);
        if (study) {
          studyAdminIDs.push(study.project);
        }
      }
    }

    // Get the IDs of studies that are visible to the user
    const studyVisibleIDs = [];
    for (const [id, isVisible] of user.roles.studyVisible) {
      if (isVisible) {
        const study = await this.studyService.find(id);
        if (study) {
          studyVisibleIDs.push(study.project);
        }
      }
    }

    // Combine all the IDs
    const allIDs = [...projectAdminIDs, ...studyAdminIDs, ...studyVisibleIDs];

    // Remove duplicates
    const uniqueIDs = [...new Set(allIDs)];

    return this.projectModel.find({ _id: { $in: uniqueIDs }, organization: user.organization }).exec();
  }

  async delete(project: Project): Promise<void> {
    // Delete all contained studies
    await this.studyService.deleteForProject(project);

    // Delete the project permissions on users
    await this.userService.removeProjectRole(project);

    // Delete the project itself
    await this.projectModel.deleteOne({ _id: project._id });
  }
}
