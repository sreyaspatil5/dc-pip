import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-with-token',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-token.component.html'
})
export class ResetWithTokenComponent {
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  resetPassword(): void {
    if (this.form.invalid) {
      this.toastr.warning('⚠️ All fields are required and must be valid.');
      return;
    }

    const token = this.form.get('token')?.value;
    const newPassword = this.form.get('newPassword')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.toastr.error('❌ Passwords do not match.');
      return;
    }

    this.isSubmitting = true;
    this.employeeService.resetPasswordWithToken(token, newPassword).subscribe({
      next: () => {
        this.toastr.success('✅ Password has been reset successfully!');
        this.router.navigate(['/login']);
        this.isSubmitting = false;
      },
      error: () => {
        this.toastr.error('❌ Failed to reset password. Please check your token.');
        this.isSubmitting = false;
      }
    });
  }
}
