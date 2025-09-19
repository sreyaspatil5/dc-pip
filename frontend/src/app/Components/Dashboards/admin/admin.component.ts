import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AddhrComponent } from './addhr/addhr.component';
import { ReportComponent } from './report/report.component';
import { EmpListComponent } from './emp-list/emp-list.component';
import { UpdateRecordsComponent } from "./update-records/update-records.component";
import { AssignManagerComponent } from '../hr/assign-manager/assign-manager.component';
import { PIPTrackComponent } from "./pip-track/pip-track.component";
import { DashComponent } from './dash/dash.component'; 
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, 
    AddhrComponent, 
    ReportComponent, 
    EmpListComponent, 
    UpdateRecordsComponent, 
    AssignManagerComponent, 
    RouterOutlet, 
    PIPTrackComponent,
    DashComponent 
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
toggleDropdown() {
throw new Error('Method not implemented.');
}

  currentView = 'addhr';
  today: Date = new Date();
  selectedEmployee: any;

  showToast = false;
  isSidebarOpen = false; 
notifications: any;
dropdownOpen: any;
  
  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.router.navigate(['/hero']);
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  goBackToLogin() {
    throw new Error('Method not implemented.');
  }
}