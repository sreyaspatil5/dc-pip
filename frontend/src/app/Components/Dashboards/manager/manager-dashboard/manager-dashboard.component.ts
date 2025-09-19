import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {
  managerId = '';        
  token: string | null = null;
  managerName = '';

  totalEmployees = 0;
  teamMembers: any[] = [];

  pipCount = 0;
  resolvedCount = 0;
  pendingReviews = 0;
  newHires = 0;
  upcomingMeetings = 0;

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.managerId = localStorage.getItem('userId') || '';
    // this.managerId = userData.employeeId || '';
    this.managerName = userData.name || 'Manager';

    if (!this.token || !this.managerId) {
      console.warn('⚠️ Token or Manager ID missing — login issue!');
      return;
    }

    this.loadTeamData();
  }

 loadTeamData(): void {
  this.empService.getAssignedEmployees().subscribe({
    next: res => {
      this.teamMembers = res;
      this.totalEmployees = res.length;
      console.log(`📦 ${this.managerName}'s Team:`, this.teamMembers);
    },
    error: err => {
      console.error('❌ Team fetch failed:', err);
    }
  });
}

}
