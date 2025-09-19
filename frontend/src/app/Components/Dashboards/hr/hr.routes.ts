import { Routes } from '@angular/router';
import { HRComponent } from './hr.component';
import { AddashboardComponent } from './addashboard/addashboard.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeDirComponent } from './employee-dir/employee-dir.component';
import { ManagersComponent } from './managers/managers.component';
import { AddToPipComponent } from './add-to-pip/add-to-pip.component';



export const branchManagerRoutes: Routes = [
  { path: '', component: AddashboardComponent }, // Default view
  { path: 'add-employee', component: AddEmployeeComponent },
  { path: 'Employee-Dir', component: EmployeeDirComponent },
  { path: 'managers', component:ManagersComponent },
  {path :'add-to-pip', component:AddToPipComponent},


];
