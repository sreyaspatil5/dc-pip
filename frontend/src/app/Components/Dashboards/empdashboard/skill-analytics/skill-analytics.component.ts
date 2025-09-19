import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-skill-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-analytics.component.html',
  styleUrls: ['./skill-analytics.component.css']
})
export class SkillAnalyticsComponent implements OnInit {

  token = '';
  employeeId = '';
  skillGaps: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';

    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        this.employeeId = user?.id || '';
      } catch {
        this.employeeId = '';
      }
    }

    if (!this.employeeId || !this.token) {
      this.errorMessage = 'Authentication missing. Please log in again.';
      this.isLoading = false;
      return;
    }

    this.loadSkillGaps();
  }

  loadSkillGaps(): void {
    this.empService.getEmployeeSkillGaps(this.employeeId, this.token).subscribe({
      next: (data) => {
        console.log("✅ Employee Skill Gaps:", data);   // Debug karo
        this.skillGaps = Array.isArray(data) ? data : [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching skill gaps:', err);
        this.errorMessage = 'Failed to load skill gaps.';
        this.isLoading = false;
      }
    });
  }
}
