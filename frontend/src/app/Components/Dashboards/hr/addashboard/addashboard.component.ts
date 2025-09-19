import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-addashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addashboard.component.html',
  styleUrls: ['./addashboard.component.css']
})
export class AddashboardComponent implements AfterViewInit {
  totalEmployees = 0;
  pipCount = 0;
  inactiveCount = 0;
  token: string | null = null;

  constructor(private empService: EmployeeService) {}

  ngAfterViewInit(): void {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      console.warn('⚠️ Token missing — cannot fetch HR dashboard data.');
      return;
    }

    // ✅ Total Employees
    this.empService.getAllEmployees(this.token).subscribe({
      next: (res: any[]) => {
        this.totalEmployees = res.length;
      },
      error: err => console.error('❌ Total Employees fetch failed:', err)
    });

    // ✅ Under PIP
    this.empService.getEmployeesByStatus('PIP', this.token).subscribe({
      next: (res: any[]) => {
        this.pipCount = res.length;
      },
      error: err => console.error('❌ PIP Count fetch failed:', err)
    });

    // ✅ Inactive Employees
    this.empService.getEmployeesByStatus('INACTIVE', this.token).subscribe({
      next: (res: any[]) => {
        this.inactiveCount = res.length;
      },
      error: err => console.error('❌ Inactive Count fetch failed:', err)
    });
  }
}
