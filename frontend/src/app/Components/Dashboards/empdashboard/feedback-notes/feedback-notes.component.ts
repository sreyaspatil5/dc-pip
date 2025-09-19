import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { EmployeeService } from '../../../../services/employee.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback-notes',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './feedback-notes.component.html',
  styleUrls: ['./feedback-notes.component.css']
})
export class FeedbackNotesComponent implements OnInit {
  receivedFeedbacks: any[] = []; // Sirf received feedbacks ka array hai
  userId = localStorage.getItem('userId') || localStorage.getItem('employeeId');
  token = localStorage.getItem('token');
  private service = inject(EmployeeService);
  private router = inject(Router);

  ngOnInit(): void {
    if (!this.userId || !this.token) {
      console.warn('⚠️ userId or token is missing from localStorage. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    // ✅ Sirf received feedback ke liye API call
    this.service.getFeedbacksReceived(this.userId, this.token).subscribe({
      next: (res: any[]) => {
        this.receivedFeedbacks = res;
        console.log('✅ Received Feedbacks fetched:', res);
      },
      error: (err: any) => {
        console.error('❌ Received Feedback fetch error:', err);
      }
    });
  }
}