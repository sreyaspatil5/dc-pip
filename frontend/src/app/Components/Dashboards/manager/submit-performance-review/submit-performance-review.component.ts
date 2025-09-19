import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Employee, EmployeeService } from '../../../../services/employee.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-submit-performance-review',
  templateUrl: './submit-performance-review.component.html',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
})
export class SubmitPerformanceReviewComponent implements OnInit {
  reviewForm!: FormGroup;
  employees: Employee[] = [];
  reviewerId = '';
  reviewerLoaded = false;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      employeeId: ['', Validators.required],
      reviewPeriod: ['', [Validators.required, this.reviewPeriodValidator.bind(this)]],
      technical: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      communication: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      teamwork: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: [''],
      reviewType: ['Monthly', Validators.required],
    });

    const token = localStorage.getItem('token');
    if (token) {
      this.loadEmployees();
      const reviewerId = this.employeeService.getReviewerIdFromToken();
      if (reviewerId) {
        this.reviewerId = reviewerId;
        this.reviewerLoaded = true;
      } else {
        this.showError('Failed to extract reviewer ID from token.');
      }
    } else {
      this.showError('User not authenticated! Please log in again.');
    }
  }

  reviewPeriodValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value?.trim();
    if (!value) return null;

    const mmYYYY = /^(0[1-9]|1[0-2])\/\d{4}$/;
    const quarter = /^Q[1-4]\s\d{4}$/;
    const range = /^[A-Za-z]{3}–[A-Za-z]{3}\s\d{4}$/;
    const onlySpecials = /^[^a-zA-Z0-9]+$/;

    if (onlySpecials.test(value)) {
      return { onlySpecialChars: true };
    }

    if (!mmYYYY.test(value) && !quarter.test(value) && !range.test(value)) {
      return { invalidFormat: true };
    }

    return null;
  }

  loadEmployees(): void {
    this.employeeService.getAssignedEmployees().subscribe({
      next: (res) => (this.employees = res),
      error: () => this.showError('Failed to load employees.'),
    });
  }

  calculateAverage(scores: { technical: number; communication: number; teamwork: number }): number {
    return +((scores.technical + scores.communication + scores.teamwork) / 3).toFixed(2);
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.showError('Please fill all required fields correctly.');
      this.reviewForm.markAllAsTouched();
      return;
    }

    if (!this.reviewerLoaded || !this.reviewerId) {
      this.showError('Reviewer information not ready yet.');
      return;
    }

    const formValues = this.reviewForm.value;
    const scores = {
      technical: Number(formValues.technical),
      communication: Number(formValues.communication),
      teamwork: Number(formValues.teamwork),
    };

    const payload = {
      employeeId: formValues.employeeId,
      reviewerId: localStorage.getItem('userId'),
      reviewPeriod: formValues.reviewPeriod,
      reviewDate: new Date().toISOString(),
      scores: JSON.stringify(scores),
      overallRating: this.calculateAverage(scores),
      comments: formValues.comments,
      reviewType: formValues.reviewType,
    };

    console.log('📤 Submitting payload:', payload);

    const token = localStorage.getItem('token') || '';
    this.loading = true;

    this.employeeService.submitPerformanceReview(payload, token).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccess('✅ Review submitted successfully!');
        this.reviewForm.reset({ reviewType: 'Monthly' });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 403) {
          this.showError('Access denied. You do not have permission to submit reviews.');
        } else {
          this.showError(err?.error?.message || 'Error submitting review.');
        }
      },
    });
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
    setTimeout(() => (this.errorMessage = null), 5000);
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => (this.successMessage = null), 5000);
  }
}
