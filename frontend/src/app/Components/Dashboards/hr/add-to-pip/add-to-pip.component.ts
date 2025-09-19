import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { EmployeeService } from '../../../../services/employee.service';
 
@Component({

  selector: 'app-add-to-pip',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './add-to-pip.component.html',

  styleUrls: ['./add-to-pip.component.css']

})

export class AddToPipComponent implements OnInit {

  employees: any[] = [];

  selectedEmployeeId: string = '';

  message: string = '';
 
  pipEntry: any = {

    employee: { employeeId: '' },  //  updated for backend

    reviewer: { employeeId: '' },  //  updated for backend

    department: '',

    designation: '',

    startDate: '',

    endDate: '',

    goals: '',

    progress: '',

    outcome: '',

    comments: '',

    status: 'PENDING'

  };
errorMessage: any;
loading: any;
pipList: any;
 
  constructor(private employeeService: EmployeeService) {}
 
  ngOnInit(): void {

    this.loadEmployees();

  }
 
  loadEmployees(): void {

    const token = localStorage.getItem('token') || '';

    this.employeeService.getAllEmployees(token).subscribe({

      next: (data) => {

        this.employees = data.filter(emp => emp.role !== 'ADMIN');

      },

      error: (err) => console.error('❌ Error loading employees:', err)

    });

  }
 
  onEmployeeSelect(employeeId: string): void {

    const selectedEmp = this.employees.find(emp => emp.employeeId === employeeId);

    if (selectedEmp) {

      this.pipEntry.employee.employeeId = selectedEmp.employeeId;  // 👈 nested structure

      this.pipEntry.department = selectedEmp.department || '';

      this.pipEntry.designation = selectedEmp.designation || '';

    }

  }
 
  private formatDateTime(date: string): string {

    const d = new Date(date);

    return d.toISOString().slice(0, 19); // "yyyy-MM-ddTHH:mm:ss"

  }
 
  submitToPip(): void {

    this.pipEntry.startDate = this.formatDateTime(this.pipEntry.startDate);

    this.pipEntry.endDate = this.formatDateTime(this.pipEntry.endDate);
 
    const token = localStorage.getItem('token') || '';

    this.employeeService.addToPip(this.pipEntry, token).subscribe({

      next: () => {

        this.message = '✅ Employee added to PIP successfully!';

        this.resetForm();

      },

      error: (err) => {

        console.error('❌ Failed to add to PIP:', err);

        this.message = '❌ Failed to add employee to PIP.';

      }

    });

  }
 
  resetForm(): void {

    this.selectedEmployeeId = '';

    this.message = '';

    this.pipEntry = {

      employee: { employeeId: '' },

      reviewer: { employeeId: '' },

      department: '',

      designation: '',

      startDate: '',

      endDate: '',

      goals: '',

      progress: '',

      outcome: '',

      comments: '',

      status: 'PENDING'

    };

  }

}

 