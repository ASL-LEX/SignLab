import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  name: string;
  url: string;
  visible: boolean;
  sublinks?: NavItem[];
}

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  navItems = {
    projects: {
      name: 'Projects',
      url: '',
      visible: true,
      sublinks: [
        {
          name: 'Project User Permissions',
          url: '/projects/user-permissions',
          visible: true,
        },
        {
          name: 'New Project',
          url: '/projects/new-project',
          visible: true,
        },
      ],
    },
    studies: {
      name: 'Studies',
      url: '',
      visible: true,
      sublinks: [
        {
          name: 'User Permissions',
          url: '/studies/user-permissions',
          visible: true,
        },
        {
          name: 'Entry Controls',
          url: '/studies/entry-controls',
          visible: true,
        },
        {
          name: 'Download Tags',
          url: '/studies/tag-download',
          visible: true,
        },
        {
          name: 'Create New Study',
          url: '/studies/create-new-study',
          visible: true,
        },
      ],
    },
    datasets: {
      name: 'Datasets',
      url: '',
      visible: true,
      sublinks: [
        {
          name: 'Dataset Controls',
          url: '/datasets/dataset-control',
          visible: true,
        },
      ],
    },
    contribute: {
      name: 'Contribute',
      url: '',
      visible: true,
      sublinks: [
        {
          name: 'Contribute to a Study',
          url: '/tag',
          visible: true,
        },
      ],
    },
  };

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }
}
