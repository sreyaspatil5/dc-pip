import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    // 🏗️ Form setup with custom validator
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.matchPasswords });
  }

  // 🔍 Custom validator for password match
  matchPasswords(form: FormGroup) {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  // 🔒 Submit handler
  resetPassword(): void {
    if (this.form.invalid) {
      this.toastr.warning('⚠️ Please fix the errors before submitting.');
      return;
    }

    const newPassword = this.form.get('newPassword')?.value;
    const email = ''; // 👈 Set email from previous step or service

    this.isSubmitting = true;
    this.employeeService.resetForgotPassword(email, newPassword).subscribe({
      next: () => {
        this.toastr.success('✅ Password reset successfully!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastr.error('❌ Password reset failed.');
        this.isSubmitting = false;
      }
    });
  }
}
