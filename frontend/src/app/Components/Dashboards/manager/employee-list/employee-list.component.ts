import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../services/employee.service';
interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'On Leave' | 'PIP';
  managerId?: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm: string = '';
  token: string = '';
  managerId: string = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.managerId = localStorage.getItem('userId') || '';

    if (this.token && this.managerId) {
      this.employeeService.getEmployees(this.managerId, this.token).subscribe({
        next: (res: Employee[]) => {
          this.employees = res;
          console.log('✅ Team Members fetched:', res.length);
        },
        error: err => {
          console.error('❌ Failed to fetch employees:', err);
        }
      });
    }
  }

  get filteredEmployees(): Employee[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.employees;

    return this.employees.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      emp.role.toLowerCase().includes(term)
    );
  }
}
