import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { EmployeeService } from '../../../../services/employee.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-skill-gap-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './skill-gap-form.component.html',
  styleUrls: ['./skill-gap-form.component.css']
})
export class SkillGapFormComponent implements OnInit {
  token = '';
  managerId = '';

  employees: any[] = [];
  skillGaps: any[] = [];
  isLoading = true;
  isLoadingGaps = false;

  errorMessage = '';
  successMessage = '';

  selectedEmployeeId = '';
  requiredSkills = '';
  currentSkills = '';
  gapLevel: number | null = null;
  skill = '';
  suggestedTraining = '';

  constructor(
    private employeeService: EmployeeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        this.managerId = user?.id || '';
      } catch {
        this.managerId = '';
      }
    }

    if (!this.token || !this.managerId) {
      this.errorMessage = 'Authentication token or Manager ID missing. Please log in again.';
      this.isLoading = false;
      return;
    }

    this.employeeService.getTeamMembers(this.managerId, this.token).subscribe({
      next: (data) => {
        this.employees = Array.isArray(data) ? data : [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching team members', err);
        this.errorMessage = 'Could not load team members!';
        this.isLoading = false;
      }
    });
  }

  isValidText(input: string): boolean {
    const trimmed = input.trim();
    const hasText = /[a-zA-Z0-9]/.test(trimmed);
    const onlySpecials = /^[^a-zA-Z0-9]+$/.test(trimmed);
    return hasText && !onlySpecials;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.selectedEmployeeId) {
      this.errorMessage = 'Please select an employee.';
      return;
    }

    if (!this.requiredSkills || !this.currentSkills || this.gapLevel === null) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    if (
      !this.isValidText(this.requiredSkills) ||
      !this.isValidText(this.currentSkills) ||
      !this.isValidText(this.skill) ||
      !this.isValidText(this.suggestedTraining)
    ) {
      this.errorMessage = 'Fields should not contain only special characters.';
      return;
    }

    const payload = {
      employeeId: this.selectedEmployeeId,
      requiredSkills: this.requiredSkills,
      currentSkills: this.currentSkills,
      gapLevel: this.gapLevel,
      skill: this.skill,
      suggestedTraining: this.suggestedTraining
    };

    console.log('📤 Sending Payload:', payload);

    this.employeeService.addSkillGap(payload, this.token).subscribe({
      next: (res) => {
        console.log('✅ Backend response:', res);
        this.successMessage = 'Skill gap submitted successfully!';
        this.errorMessage = '';
        const empId = this.selectedEmployeeId;
        this.resetForm(false);
        this.selectedEmployeeId = empId;
        this.loadSkillGaps(empId);
      },
      error: (err) => {
        console.error('❌ Submission failed:', err);
        this.errorMessage = err?.error?.message || 'Failed to submit skill gap.';
        this.successMessage = '';
      }
    });
  }

  loadSkillGaps(empId: string): void {
    if (!empId) return;
    this.isLoadingGaps = true;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    this.http
      .get<any[]>(`http://localhost:8080/api/skill-gap/employee/${empId}`, { headers })
      .subscribe({
        next: (data) => {
          this.skillGaps = Array.isArray(data) ? data : [];
          this.isLoadingGaps = false;
        },
        error: (err) => {
          console.error('Error fetching skill gaps', err);
          this.errorMessage = 'Failed to load skill gaps.';
          this.isLoadingGaps = false;
        }
      });
  }

  resetForm(clearEmployee = true): void {
    if (clearEmployee) this.selectedEmployeeId = '';
    this.requiredSkills = '';
    this.currentSkills = '';
    this.gapLevel = null;
    this.skill = '';
    this.suggestedTraining = '';
  }
}
