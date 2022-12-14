import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  name: string;
  url: string;
  sublinks?: NavItem[];
}

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  navItems: NavItem[] = [
    {
      name: 'Studies',
      url: '',
      sublinks: [
        {
          name: 'User Permissions',
          url: '/studies/user-permissions',
        },
        {
          name: 'Entry Controls',
          url: '/studies/entry-controls',
        },
        {
          name: 'Download Tags',
          url: '/studies/tag-download',
        },
        {
          name: 'Create New Study',
          url: '/studies/create-new-study',
        },
      ],
    },
    {
      name: 'Datasets',
      url: '',
      sublinks: [
        {
          name: 'Dataset Controls',
          url: '/datasets/dataset-control',
        },
      ],
    },
    {
      name: 'Contribute',
      url: '',
      sublinks: [
        {
          name: 'Contribute to a Study',
          url: '/tag',
        },
      ],
    },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }
}
