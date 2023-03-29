import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { StudyService } from '../../core/services/study.service';
import { AuthService } from '../../core/services/auth.service';
import { Project } from 'shared/dtos/project.dto';
import { Study } from 'shared/dtos/study.dto';
import { User } from '../../graphql/graphql';

interface NavElement {
  name: string;
  url: string;
  visible: boolean;
  sublinks?: NavElement[];
  visibleCondition: (project: Project | null, study: Study | null, user: User | null) => boolean;
}

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navItems: NavElement[] = [
    {
      name: 'Projects',
      url: '',
      visible: true,
      visibleCondition: (project, _study, user) => {
        // If the user is an org admin they can see projects
        if (user && user.roles.owner) {
          return true;
        }

        // If the project exists, the user can also see the project
        // if they are a project admin
        if (user && project) {
          return (user.roles.projectAdmin as any)[project._id!];
        }

        // Otherwise the user cannot see the project
        return false;
      },
      sublinks: [
        {
          name: 'Project User Permissions',
          url: '/projects/user-permissions',
          visible: true,
          visibleCondition: (project, _study, user) => {
            // If there is no active project, no user permissions are
            // visible
            if (!project) {
              return false;
            }

            if (user && user.roles.owner) {
              return true;
            }

            if (user && project) {
              return !!(user.roles.projectAdmin as any)[project._id!];
            }
            return false;
          }
        },
        {
          name: 'New Project',
          url: '/projects/new-project',
          visible: true,
          visibleCondition: (_project, _study, user) => {
            return user !== null && user.roles.owner;
          }
        }
      ]
    },
    {
      name: 'Studies',
      url: '',
      visible: true,
      visibleCondition: (project, study, user) => {
        // Owner can access studies
        if (user && user.roles.owner) {
          return true;
        }

        // Project admin can access all studies
        if (user && project && (user.roles.projectAdmin as any)[project._id!]) {
          return true;
        }

        // Study admins can access the study
        if (user && study && (user.roles.studyAdmin as any)[study._id!]) {
          return true;
        }

        // Otherwise the user cannot see the study
        return false;
      },
      sublinks: [
        {
          name: 'Study Control',
          url: '/studies/study-control',
          visible: true,
          visibleCondition(project, _study, user) {
            // Have to have a project selected to see studies
            if (!project) {
              return false;
            }

            // Need to be either the owner or the project admin to view the
            // study control
            if (user && (user.roles.owner || (user.roles.projectAdmin as any)[project._id!])) {
              return true;
            }
            return false;
          }
        },
        {
          name: 'User Permissions',
          url: '/studies/user-permissions',
          visible: true,
          visibleCondition(project, study, user) {
            // If there is no project or no active study,
            // no user permissions are visible
            if (!project || !study) {
              return false;
            }

            // Owner can access studies
            if (user && user.roles.owner) {
              return true;
            }

            // Project admin can access all studies
            if (user && project && (user.roles.projectAdmin as any)[project._id!]) {
              return true;
            }

            // Study admins can access the study
            if (user && study && (user.roles.studyAdmin as any)[study._id!]) {
              return true;
            }

            // Otherwise the user cannot see the study
            return false;
          }
        },
        {
          name: 'Entry Controls',
          url: '/studies/entry-controls',
          visible: true,
          visibleCondition(project, study, user) {
            // If there is no project or no active study,
            // no entry controls are visible
            if (!project || !study) {
              return false;
            }

            // Owner can access studies
            if (user && user.roles.owner) {
              return true;
            }

            // Project admin can access all studies
            if (user && project && (user.roles.projectAdmin as any)[project._id!]) {
              return true;
            }

            // Study admins can access the study
            if (user && study && (user.roles.studyAdmin as any)[study._id!]) {
              return true;
            }

            // Otherwise the user cannot see the study
            return false;
          }
        },
        {
          name: 'Download Tags',
          url: '/studies/tag-download',
          visible: true,
          visibleCondition(project, study, user) {
            // If there is no project or no active study,
            // no tags are possible to be downloaded
            if (!project || !study) {
              return false;
            }

            // Owner can access studies
            if (user && user.roles.owner) {
              return true;
            }

            // Project admin can access all studies
            if (user && project && (user.roles.projectAdmin as any)[project._id!]) {
              return true;
            }

            // Study admins can access the study
            if (user && study && (user.roles.studyAdmin as any)[study._id!]) {
              return true;
            }

            // Otherwise the user cannot see the study
            return false;
          }
        },
        {
          name: 'Create New Study',
          url: '/studies/create-new-study',
          visible: true,
          visibleCondition(project, _study, user) {
            // Owners can make a new study
            if (user && user.roles.owner) {
              return true;
            }

            // Project admins can make a new study
            if (user && project && (user.roles.projectAdmin as any)[project._id!]) {
              return true;
            }

            // Other users cannot make a new study
            return false;
          }
        }
      ]
    },
    {
      name: 'Datasets',
      url: '',
      visible: true,
      visibleCondition: (_project, _study, user) => {
        // Owner can access datasets only right now
        // TODO: Add project and study admins
        return user !== null && user.roles.owner;
      },
      sublinks: [
        {
          name: 'Dataset Controls',
          url: '/datasets/dataset-control',
          visible: true,
          visibleCondition(_project, _study, user) {
            // Owner can access datasets only right now
            // TODO: Add project and study admins
            return user !== null && user.roles.owner;
          }
        },
        {
          name: 'Project Access',
          url: '/datasets/project-access',
          visible: true,
          visibleCondition(_project, _study, user) {
            return user !== null && user.roles.owner;
          }
        }
      ]
    },
    {
      name: 'Contribute',
      url: '',
      visible: true,
      visibleCondition: (project, study, user) => {
        // If there is no project or no active study,
        // nothing to contribute to
        if (!project || !study) {
          return false;
        }

        // Owner can contribute to any study
        if (user && user.roles.owner) {
          return true;
        }

        // Project admin can contribute to a study that is part of their project
        if (user && project && (user.roles.projectAdmin as any)[project._id!]) {
          return true;
        }

        // Study admins can contribute to a study that is part of their study
        if (user && study && (user.roles.studyAdmin as any)[study._id!]) {
          return true;
        }

        // A user who is marked as a contributor can contribute to a study
        if (user && study && (user.roles.studyVisible as any)[study._id!]) {
          return true;
        }
        return false;
      },
      sublinks: [
        {
          name: 'Contribute to a Study',
          url: '/tag',
          visible: true,
          visibleCondition: (project, study, user) => {
            // Owner can contribute to any study
            if (user && user.roles.owner) {
              return true;
            }

            // Project admin can contribute to a study that is part of their project
            if (user && project && (user.roles.projectAdmin as any)[project._id!]) {
              return true;
            }

            // Study admins can contribute to a study that is part of their study
            if (user && study && (user.roles.studyAdmin as any)[study._id!]) {
              return true;
            }

            // A user who is marked as a contributor can contribute to a study
            if (user && study && (user.roles.studyVisible as any)[study._id!]) {
              return true;
            }
            return false;
          }
        }
      ]
    }
  ];

  activeProject: Project | null = null;
  activeStudy: Study | null = null;

  constructor(
    public authService: AuthService,
    private router: Router,
    projectService: ProjectService,
    studyService: StudyService
  ) {
    projectService.activeProject.subscribe((project) => {
      this.activeProject = project;
      this.updateNavItems();
    });

    studyService.activeStudy.subscribe((study) => {
      this.activeStudy = study;
      this.updateNavItems();
    });
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  /**
   * Updates the router links based on the current user's permissions
   */
  updateNavItems() {
    const user = this.authService.isAuthenticated() ? this.authService.user : null;

    // Update the visibility of each top-level nav item
    for (const navItem of this.navItems) {
      navItem.visible = navItem.visibleCondition(this.activeProject, this.activeStudy, user);

      if (navItem.sublinks) {
        // Update the visibility of each sublink
        for (const sublink of navItem.sublinks) {
          sublink.visible = sublink.visibleCondition(this.activeProject, this.activeStudy, user);
        }
      }
    }
  }
}
