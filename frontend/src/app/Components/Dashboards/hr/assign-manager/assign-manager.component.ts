import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../../services/employee.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-manager.component.html',
  styleUrls: ['./assign-manager.component.css']
})
export class AssignManagerComponent implements OnInit {
  employeeList: any[] = [];
  managerList: any[] = [];
  selectedEmployeeId: string = '';
  currentManager: any = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadManagers();
  }

  loadEmployees(): void {
    const token = localStorage.getItem('token') || '';
    this.employeeService.getAllEmployees(token).subscribe({
      next: (data: any[]) => {
        this.employeeList = data.filter(emp => emp.role?.toLowerCase() === 'employee');
      },
      error: (err: any) => console.error('❌ Failed to load employees', err)
    });
  }

  loadManagers(): void {
    const token = localStorage.getItem('token') || '';
    this.employeeService.getAllEmployees(token).subscribe({
      next: (data: any[]) => {
        this.managerList = data
          .filter(emp => emp.role?.toLowerCase() === 'manager')
          .map(mgr => ({
            ...mgr,
            status: mgr.status || 'AVAILABLE'
          }));
      },
      error: (err: any) => console.error('❌ Failed to load managers', err)
    });
  }

  onEmployeeChange(empId: string): void {
    const selectedEmp = this.employeeList.find(emp => emp.employeeId === empId);
    this.currentManager = selectedEmp?.managerId
      ? this.managerList.find(mgr => mgr.employeeId === selectedEmp.managerId)
      : null;
  }

  assignManagerToEmployee(managerId: string): void {
    const token = localStorage.getItem('token') || '';
    if (!this.selectedEmployeeId) {
      alert('⚠️ Please select an employee first.');
      return;
    }

    if (this.currentManager?.employeeId === managerId) {
      alert('ℹ️ This manager is already assigned.');
      return;
    }

    this.employeeService.assignManager(this.selectedEmployeeId, managerId, token).subscribe({
      next: () => {
        alert('✅ Manager assigned successfully!');
        this.loadEmployees();
        this.loadManagers();
        this.selectedEmployeeId = '';
        this.currentManager = null;
      },
      error: (err) => {
        alert('❌ Failed to assign. Try again!');
        console.error(err);
      }
    });
  }
}
