import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../../services/employee.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emp-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})
export class EmpListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  pageSize = 10;
  currentPage = 0;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    const token = localStorage.getItem('token') || '';
    this.employeeService.getAllEmployees(token).subscribe({
      next: (data: any[]) => {
        this.employees = data
          .filter(emp => emp?.name && emp?.email)
          .sort((a, b) => a.name.localeCompare(b.name)); // ✅ sort alphabetically
        this.applyFilter();
      },
      error: (err) => {
        console.error('❌ Failed to load employees', err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredEmployees = this.employees
      .filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term)
      )
      .sort((a, b) => a.name.localeCompare(b.name)); // ✅ keep sorted after filter
    this.currentPage = 0;
  }

  get paginatedEmployees(): any[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toUpperCase()) {
      case 'HR': return 'bg-purple-100 text-purple-700';
      case 'MANAGER': return 'bg-blue-100 text-blue-700';
      case 'EMPLOYEE': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
