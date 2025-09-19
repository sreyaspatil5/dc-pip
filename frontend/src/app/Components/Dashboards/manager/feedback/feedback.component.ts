import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { EmployeeService } from '../../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  employees: any[] = [];
  selectedEmployeeId: string | null = null;
  comment = '';
  rating: number | null = null;

  errorMessage = '';
  successMessage = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.fetchAssignedEmployees();
  }

  fetchAssignedEmployees() {
    this.employeeService.getAssignedEmployees().subscribe({
      next: (res: any[]) => {
        this.employees = res;
      },
      error: (err: any) => {
        console.error('❌ Error fetching employees:', err);
        alert('⚠️ Unauthorized or failed to fetch assigned employees');
      }
    });
  }

  submitFeedback() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedEmployeeId) {
      this.errorMessage = 'Please select an employee.';
      return;
    }

    if (!this.comment.trim()) {
      this.errorMessage = 'Comment is required.';
      return;
    }

    if (this.rating === null || this.rating < 1 || this.rating > 5) {
      this.errorMessage = 'Rating must be between 1 and 5.';
      return;
    }

    // Optional: Check if feedback already exists for this employee
    // Uncomment if backend supports this check
    // this.employeeService.checkIfFeedbackExists(this.selectedEmployeeId).subscribe({
    //   next: (exists) => {
    //     if (exists) {
    //       this.errorMessage = 'Feedback already submitted for this employee.';
    //       return;
    //     } else {
    //       this.submitToServer();
    //     }
    //   }
    // });

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const feedbackData = {
      toUserId: this.selectedEmployeeId,
      feedbackType: 'MANAGER',
      comments: this.comment,
      rating: this.rating,
      isAnonymous: false
    };

    this.employeeService.submitFeedback(feedbackData, headers).subscribe({
      next: (res) => {
        this.successMessage = 'Feedback submitted successfully!';
        this.comment = '';
        this.rating = null;
        this.selectedEmployeeId = null;
        this.fetchAssignedEmployees();
      },
      error: (err) => {
        console.error('❌ Error submitting feedback:', err);
        this.errorMessage = 'Failed to submit feedback.';
      }
    });
  }
}
