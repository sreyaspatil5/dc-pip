import { Routes } from '@angular/router';

export const managerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manager.component').then(m => m.ManagerComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
      },
      {
        path: 'employees',
        loadComponent: () => import('./employee-list/employee-list.component').then(m => m.EmployeeListComponent)
      },
      {
        path: 'performance-review',
        loadComponent: () => import('./submit-performance-review/submit-performance-review.component').then(m => m.SubmitPerformanceReviewComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];
