import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'hero', pathMatch: 'full' },

  {
    path: 'hero',
    loadComponent: () => import('./Components/hero/hero.component').then(m => m.HeroComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./Components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'empdashboard',
    loadComponent: () => import('./Components/Dashboards/empdashboard/empdashboard.component').then(m => m.EmpdashboardComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./Components/Dashboards/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'hr',
    loadComponent: () => import('./Components/Dashboards/hr/hr.component').then(m => m.HRComponent)
  },

  // ✅ Lazy load Manager module
  {
    path: 'manager',
    loadChildren: () => import('./Components/Dashboards/manager/manager.routes').then(m => m.managerRoutes)
  },

  // ✅ Lazy load Forgot Password module
  {
    path: 'forgot-password',
    loadChildren: () => import('./Components/forgot-password/forgot-password.route').then(m => m.forgotPasswordRoutes)
  },

  { path: '**', redirectTo: 'hero' }
];
