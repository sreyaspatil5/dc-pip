import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  report = {
    totalEmployees: 0,
    totalHRs: 0,
    totalManagers: 0,
    totalAdmins: 0
  };

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ Token not found');
      return;
    }

    this.empService.getAllEmployees(token).subscribe({
      next: (employees) => {
        this.report.totalEmployees = employees.length;
        this.report.totalHRs = employees.filter(emp => emp.role?.toUpperCase() === 'HR').length;
        this.report.totalManagers = employees.filter(emp => emp.role?.toUpperCase() === 'MANAGER').length;
        this.report.totalAdmins = employees.filter(emp => emp.role?.toUpperCase() === 'ADMIN').length;
      },
      error: (err) => console.error('❌ Failed to load employees', err)
    });
  }
}
