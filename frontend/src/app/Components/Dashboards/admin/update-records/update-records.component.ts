import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../services/employee.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-update-records',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './update-records.component.html',
  styleUrls: ['./update-records.component.css']
})
export class UpdateRecordsComponent implements OnInit {
  employeeList: any[] = [];
  filteredEmployees: any[] = [];
  paginatedEmployees: any[] = [];
  selectedEmployee: any = null;
  showUpdateForm = false;
  showSuccessPopup = false;

  searchTerm: string = '';
  pageSize = 5;
  currentPage = 0;

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    const token = localStorage.getItem('token');
    if (!token) return console.error('❌ No token found');

    this.empService.getAllEmployees(token).subscribe({
      next: (res: any[]) => {
        this.employeeList = res
          .filter(emp => emp?.name && emp?.email && emp?.role && emp?.department && emp?.employeeId)
          .sort((a, b) => a.name.localeCompare(b.name));
        this.filteredEmployees = [...this.employeeList];
        this.updatePaginatedEmployees();
      },
      error: (err) => console.error('❌ Failed to load employees:', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredEmployees = this.employeeList
      .filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.role.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term)
      )
      .sort((a, b) => a.name.localeCompare(b.name)); // ✅ keep sorted
    this.currentPage = 0;
    this.updatePaginatedEmployees();
  }

  updatePaginatedEmployees(): void {
    const start = this.currentPage * this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedEmployees();
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'manager': return 'bg-yellow-100 text-yellow-700';
      case 'employee': return 'bg-green-100 text-green-700';
      case 'hr': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  onEditClick(emp: any): void {
    this.selectedEmployee = JSON.parse(JSON.stringify(emp)); // deep clone
    this.showUpdateForm = true;
  }

  closeForm(): void {
    this.showUpdateForm = false;
    this.selectedEmployee = null;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(): void {
    if (this.showUpdateForm) this.closeForm();
  }

  submitUpdate(): void {
    const token = localStorage.getItem('token');
    const employeeId = this.selectedEmployee?.employeeId;

    if (!token || !employeeId) {
      console.error('❌ Token or employee ID missing');
      return;
    }

    this.selectedEmployee.email = this.selectedEmployee.email.trim().toLowerCase();

    this.empService.updateEmployee(employeeId, this.selectedEmployee, token).subscribe({
      next: () => {
        this.showSuccessPopup = true;
        this.closeForm();
        this.loadEmployees();
        setTimeout(() => this.showSuccessPopup = false, 3000);
      },
      error: (err) => {
        console.error('❌ Update failed:', err);
        alert('❌ Failed to update employee.');
      }
    });
  }
}
