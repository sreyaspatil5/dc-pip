import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // ✅ Added RouterModule
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  form: FormGroup;
  activeTab: 'otp' | 'link' | 'token' = 'otp';

  showPassword = false;
  showConfirmPassword = false;
  passwordStrength: 'Weak' | 'Medium' | 'Strong' | '' = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
      resetToken: [''],
      newPassword: [''],
      confirmPassword: ['']
    });

    this.form.get('newPassword')?.valueChanges.subscribe(value => {
      this.passwordStrength = this.evaluateStrength(value);
    });
  }

  togglePasswordVisibility(field: 'new' | 'confirm') {
    field === 'new'
      ? (this.showPassword = !this.showPassword)
      : (this.showConfirmPassword = !this.showConfirmPassword);
  }

  evaluateStrength(password: string): 'Weak' | 'Medium' | 'Strong' | '' {
    if (!password) return '';
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password);
    const length = password.length;

    const score = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

    if (length >= 8 && score >= 3) return 'Strong';
    if (length >= 6 && score >= 2) return 'Medium';
    return 'Weak';
  }

  submitResetRequest() {
  const emailControl = this.form.get('email');

  if (!emailControl || emailControl.invalid) {
    emailControl?.markAsTouched();
    emailControl?.setErrors({ required: true });

    alert('❌ Email is required');
    return;
  }

  const email = emailControl.value;

  this.employeeService.requestOtp(email).subscribe({
    next: () => alert('✅ OTP sent to your email!'),
    error: () => alert('❌ Failed to send OTP.')
  });

  }

  verifyOtpReset() {
    const { email, otp, newPassword, confirmPassword } = this.form.value;
    if (newPassword !== confirmPassword) {
      alert("❌ Passwords don't match");
      return;
    }

    this.employeeService.verifyOtpAndReset(email, otp, newPassword).subscribe({
      next: () => {
        alert('✅ Password reset successful!');
        this.router.navigate(['/login']);
      },
      error: () => alert('❌ Invalid OTP or reset failed.')
    });
  }

  sendResetLink() {
    const email = this.form.get('email')?.value;
    const baseUrl = 'http://localhost:4200';
    if (!email) return;

    this.employeeService.requestResetLink(email, baseUrl).subscribe({
      next: (res: any) => {
        alert('✅ Password reset link has been sent to your registered email.');
      },
      error: (err) => {
        if (err?.error?.message?.includes('sent')) {
          alert('✅ Password reset link has been sent to your registered email.');
        } else {
          alert('❌ Failed to send reset link. Please try again.');
        }
      }
    });
  }






  requestResetToken() {
    const email = this.form.get('email')?.value;
    if (!email) return;

    this.employeeService.requestResetToken(email).subscribe({
      next: () => alert('✅ Token sent to your email!'),
      error: () => alert('❌ Failed to send token.')
    });
  }

  resetWithToken() {
    const { resetToken, newPassword, confirmPassword } = this.form.value;
    if (newPassword !== confirmPassword) {
      alert("❌ Passwords don't match");
      return;
    }

    this.employeeService.resetPasswordWithToken(resetToken, newPassword).subscribe({
      next: () => {
        alert('✅ Password reset successful!');
        this.router.navigate(['/login']);
      },
      error: () => alert('❌ Invalid token or reset failed.')
    });
  }
}
