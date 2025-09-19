import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-employee-dir',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-dir.component.html',
  styleUrls: ['./employee-dir.component.css']
})
export class EmployeeDirComponent implements OnInit {
  employees: any[] = [];

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    this.empService.getEmployeesByRole('EMPLOYEE', token).subscribe({
      next: (data: any[]) => {
        this.employees = data;
      },
      error: (err: any) => {
        console.error('❌ Failed to load employees', err);
      }
    });
  }
}
