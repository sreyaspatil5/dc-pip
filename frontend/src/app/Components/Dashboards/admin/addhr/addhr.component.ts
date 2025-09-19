import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EmployeeService, HrSignupPayload } from '../../../../services/employee.service';

@Component({
  selector: 'app-addhr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addhr.component.html',
  styleUrls: ['./addhr.component.css']
})
export class AddhrComponent implements OnInit {
  hr: HrSignupPayload = {
    name: '',
    email: '',
    employeeId: '',
    department: 'HR',
    role: 'HR',
    password: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.hr.department = 'HR'; // ✅ Default department
  }

  submitForm(form: NgForm): void {
    const { name, email, employeeId, department } = this.hr;
    const currentUserEmail = localStorage.getItem('email');
    const token = localStorage.getItem('token') || '';

    const trimmedEmail = email.trim().toLowerCase();

    if (form.invalid) {
      this.errorMessage = '⚠️ Please fix the validation errors.';
      this.successMessage = '';
      return;
    }

    if (currentUserEmail !== 'admin@gmail.com') {
      this.errorMessage = '🚫 Access denied. Only Admin can register HRs.';
      this.successMessage = '';
      return;
    }

    const payload = {
      name: name.trim(),
      email: trimmedEmail,
      employee_id: employeeId.trim(),
      department: department.trim(),
      role: 'HR'
    };

    this.empService.signupHR(payload as any, token).subscribe({
      next: (res) => {
        console.log('✅ HR Registered Successfully:', res);
        this.successMessage = ' HR registered successfully!';
        this.errorMessage = '';
        form.resetForm({ department: 'HR' }); // ✅ Reset with default
      },
      error: (err) => {
        const msg = err.status === 403
          ? 'Unauthorized (403): You do not have permission to register HRs.'
          : 'Something went wrong while registering.';
        this.errorMessage = `🚫 Registration failed: ${msg}`;
        this.successMessage = '';
      }
    });
  }
}