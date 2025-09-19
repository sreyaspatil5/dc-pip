import { Component, OnInit } from '@angular/core';

// import { FormBuilder, Validators, ReactiveFormsModule,  FormGroup } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';

import { EmployeeService } from '../../../services/employee.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 
@Component({

  selector: 'app-verify-otp-reset',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './verify-otp.component.html'

})

export class VerifyOtpResetComponent implements OnInit {
 
  // Reactive form

  form = this.fb.group({

    email: ['', [Validators.required, Validators.email]],

    otp: ['', Validators.required],

    newPassword: ['', Validators.required]

  });
 
  constructor(

    private fb: FormBuilder,

    private route: ActivatedRoute,

    private router: Router,

    private employeeService: EmployeeService

  ) {}
 
  ngOnInit(): void {

    // Pre-fill email if passed via query params

    this.route.queryParams.subscribe(params => {

      if (params['email']) {

        this.form.patchValue({ email: params['email'] });

      }

    });

  }
 
  // Verify OTP & reset password

  verifyAndReset(): void {

    if (this.form.invalid) {

      alert('⚠ Please fill all required fields correctly.');

      return;

    }
 
    const { email, otp, newPassword } = this.form.value;
 
    this.employeeService.verifyOtpAndReset(email!, otp!, newPassword!).subscribe({

      next: () => {

        alert('✅ Password reset successful');

        this.router.navigate(['/login']);

      },

      error: (err) => {

        console.error('OTP verification failed:', err);

        alert('❌ OTP verification failed. Please check and try again.');

      }

    });

  }

}

 