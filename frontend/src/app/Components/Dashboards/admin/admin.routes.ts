import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AddhrComponent } from './addhr/addhr.component';
import { DashComponent } from './dash/dash.component';
import { ReportComponent } from './report/report.component';
import { EmpListComponent } from './emp-list/emp-list.component';

export const branchManagerRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'addhr', pathMatch: 'full' }, 
      { path: 'addhr', component: AddhrComponent },
      { path: 'report', component: ReportComponent },
      { path: 'emp-list', component: EmpListComponent },
      { path: 'dashboard', component: DashComponent }
    ]
  }
];
