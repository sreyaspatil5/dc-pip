import { Component, OnInit, inject } from '@angular/core';

import { CommonModule, NgIf, NgFor } from '@angular/common';

import { EmployeeService, JwtPayload } from '../../../../services/employee.service';
 
@Component({

  selector: 'app-performance-review',

  standalone: true,

  imports: [CommonModule, NgIf, NgFor],

  templateUrl: './performance-review.component.html',

  styleUrls: ['./performance-review.component.css']

})

export class PerformanceReviewComponent implements OnInit {

  private employeeService = inject(EmployeeService);

  reviews: any[] = [];

  employeeId = '';

  token = '';
 
  ngOnInit(): void {

    const userString = localStorage.getItem('user');

    const token = localStorage.getItem('token');
 
    if (userString && token) {

      const user: JwtPayload = JSON.parse(userString);

      this.employeeId = user.id ?? '';

      this.token = token;
 
      if (this.employeeId) {

        this.fetchReviews();

      } else {

        console.error('Employee ID missing from user data');

      }

    } else {

      console.error('User data or token missing');

    }

  }
 
  fetchReviews(): void {

    this.employeeService.getPerformanceReviewsByEmployeeId(this.employeeId, this.token).subscribe({

      next: (data) => {

        this.reviews = data.map((review: any) => ({

          reviewPeriod: review.reviewPeriod,

          overallRating: review.overallRating,

          reviewerId: review.reviewerId,

          comments: review.comments,

          reviewType: review.reviewType,

          scores: review.scores ? JSON.parse(review.scores) : null,

          reviewDate: review.reviewDate

        }));

      },

      error: (err) => console.error('Error fetching reviews', err),

    });

  }

}

 