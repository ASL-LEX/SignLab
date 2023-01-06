import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';


interface NavItem {
  name: string;
  url: string;
  sublinks?: NavItem[];
}

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navItems: NavItem[] = [
    {
      name: 'Organization',
      url: '/organization',
      sublinks: [
        {
          name: 'User Permissions',
          url: '/organization/user-permissions'
        },
      ],
    },
    {
      name: 'Project',
      url: '/project',
      sublinks: [
        {
          name: 'User Permissions',
          url: '/project/user-permissions'
        },
        {
          name: 'Dataset Access',
          url: '/project/dataset-access'
        },
        {
          name: 'Create New Project',
          url: '/project/create-new-project'
        }
      ],
    },
    {
      name: 'Studies',
      url: '/studies',
      sublinks: [
        {
          name: 'User Permissions',
          url: '/studies/user-permissions'
        },
        {
          name: 'Entry Controls',
          url: '/studies/entry-controls'
        },
        {
          name: 'Contribute',
          url: '/studies/contribute'
        },
        {
          name: 'Create New Study',
          url: '/studies/create-new-study'
        }
      ],
    },
    {
      name: 'Datasets',
      url: '/datasets',
      sublinks: [
        {
          name: 'Dataset Controls',
          url: '/datasets/dataset-control'
        },
      ],
    },
    {
      name: 'Contribute',
      url: '/contribute',
      sublinks: [
        {
          name: 'Contribute to a Study',
          url: '/tag'
        },
      ],
    }
  ];


  constructor(public authService: AuthService) {}
}
