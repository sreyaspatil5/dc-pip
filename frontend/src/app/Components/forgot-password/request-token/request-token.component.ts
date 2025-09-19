import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request-token',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-token.component.html',
})
export class RequestTokenComponent {
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  requestToken() {
    if (this.form.invalid) return;

    const email = this.form.get('email')?.value;
    this.isSubmitting = true;

    // ✅ Use requestResetToken, NOT resetPasswordWithToken
    this.employeeService.requestResetToken(email).subscribe({
      next: () => {
        this.toastr.success('📩 Reset token has been sent to your email.');
        this.isSubmitting = false;
      },
      error: () => {
        this.toastr.error('❌ Failed to send reset token.');
        this.isSubmitting = false;
      }
    });
  }
}
