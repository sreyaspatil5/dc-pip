

import { Component } from '@angular/core';

import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

 
@Component({

  selector: 'app-request-otp',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './request-otp.component.html'

})

export class RequestOtpComponent {

  form = this.fb.group({

    email: ['', [Validators.required, Validators.email]]

  });
 
  constructor(

    private fb: FormBuilder,

    private employeeService: EmployeeService,

    private router: Router

  ) {}
 
  requestOtp() {

    if (this.form.invalid) return;
 
    const email = this.form.value.email!;
 
    this.employeeService.requestOtp(email).subscribe({

      next: (res) => {

        console.log('✅ OTP Response:', res);

        alert('✅ OTP sent to your email!');

        this.router.navigate(['/forgot-password/verify-otp-reset'], { queryParams: { email } });

      },

      error: (err) => {

        console.error('❌ Error sending OTP:', err);

        alert(err?.error?.message || '❌ Failed to send OTP.');

      }

    });

  }

}

 