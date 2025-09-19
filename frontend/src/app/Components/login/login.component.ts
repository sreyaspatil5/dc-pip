import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, animate, style } from '@angular/animations';
import { EmployeeService } from '../../services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeOutUp', [
      transition(':leave', [
        animate('300ms ease', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  showLogin = true;
  email = '';
  password = '';
  errorMessage = '';
  role = 'ADMIN'; // Default role
  isLoading = false;
  showPassword = false;
  showToast = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // ✅ Real-time email validation
  validateEmail() {
    const trimmed = this.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (this.email !== trimmed) {
      this.errorMessage = 'Email must not contain leading or trailing spaces.';
    } else if (!emailRegex.test(trimmed)) {
      this.errorMessage = 'Please enter a valid email address.';
    } else if (trimmed !== trimmed.toLowerCase()) {
      this.errorMessage = 'Email must be in lowercase only.';
    } else {
      this.errorMessage = '';
    }
  }

  // ✅ Login logic with validation enforcement
  login() {
    this.validateEmail();

    if (this.errorMessage) {
      return; // ⛔ Block login if validation fails
    }

    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      this.errorMessage = 'Both email and password are required.';
      return;
    }

    const allowedRoles = ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'];
    if (!allowedRoles.includes(this.role)) {
      this.errorMessage = 'Selected role is invalid.';
      return;
    }

    this.isLoading = true;

    this.employeeService.login(trimmedEmail, trimmedPassword, this.role).subscribe({
      next: (res: any) => {
        const employee = res.employee || res.user || res || null;

        if (!employee) {
          this.errorMessage = 'Server response is invalid. Please contact the administrator.';
          this.isLoading = false;
          return;
        }

        const actualRole = employee.role ? employee.role.toUpperCase() : 'UNKNOWN';

        if (actualRole !== this.role) {
          this.errorMessage = `Role mismatch: You selected "${this.role}", but your account is assigned to "${actualRole}".`;
          this.toastr.error(this.errorMessage);
          this.isLoading = false;
          return;
        }

        localStorage.setItem('token', res.token || '');
        localStorage.setItem('userId', employee.id || '');
        localStorage.setItem('email', employee.email || '');
        localStorage.setItem('role', actualRole);
        localStorage.setItem('user', JSON.stringify(employee));

        this.toastr.success(`Welcome ${employee.name || employee.email}! 🎉`, 'Login Successful');
        this.showToast = true;

        switch (actualRole) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'HR':
            this.router.navigate(['/hr']);
            break;
          case 'MANAGER':
            this.router.navigate(['/manager']);
            break;
          case 'EMPLOYEE':
            this.router.navigate(['/empdashboard']);
            break;
          default:
            this.errorMessage = 'Unknown role. Please contact the administrator.';
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Login failed: Invalid credentials or unauthorized access.';
        console.error('❌ Login Error:', err);
        this.toastr.error('Login failed. Please try again.');
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  navigatetoemp() {
    this.role = 'EMPLOYEE';
    this.errorMessage = '';
  }

  navigatetomanager() {
    this.role = 'MANAGER';
    this.errorMessage = '';
  }

  navigatetohr() {
    this.role = 'HR';
    this.errorMessage = '';
  }

  navigatetoadmin() {
    this.role = 'ADMIN';
    this.errorMessage = '';
  }

  onClose() {
    this.errorMessage = '';
  }
}
