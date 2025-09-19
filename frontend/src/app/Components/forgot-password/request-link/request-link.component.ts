import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-request-link',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-link.component.html'
})
export class RequestLinkComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendLink() {
    const emailControl = this.form.get('email');

    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      emailControl?.setErrors({ required: true });

      alert('❌ Email field is required');
      return;
    }

    const email = emailControl.value;
    const baseUrl = 'http://localhost:4200';

    this.employeeService.requestResetLink(email, baseUrl).subscribe({
      next: () => {
        alert('✅ Reset link sent to your email!');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('❌ Failed to send reset link.');
      }
    });
  }
}
