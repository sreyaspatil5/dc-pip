import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-reset-link',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-link.component.html'
})
export class ResetLinkComponent {
  form: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    // ✅ Get token from URL (query parameter)
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token');
  }

  resetPassword() {
    if (this.form.invalid || !this.token) return;

    const newPassword = this.form.get('newPassword')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      alert("❌ Passwords do not match.");
      return;
    }

    this.employeeService.resetPasswordWithToken(this.token, newPassword).subscribe({
      next: () => {
        alert('✅ Password reset successful!');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('❌ Password reset failed. Invalid or expired token.');
      }
    });
  }
}
