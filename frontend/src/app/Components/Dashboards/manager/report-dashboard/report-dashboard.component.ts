import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.css']
})
export class ReportDashboardComponent implements OnInit {
  token = '';
  managerId = '';
  employees: any[] = [];
  reports: any[] = [];
  isLoading = true;
  isSubmitting = false;

  selectedEmployeeId = '';
  reportType = '';
  fileUrl = '';
  selectedFile: File | null = null;
  editingReportId: string | null = null;

  errorMessage = '';
  successMessage = '';

  constructor(private employeeService: EmployeeService) {}

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

    this.loadEmployees();
    this.loadReports();
  }

  loadEmployees(): void {
    this.employeeService.getTeamMembers(this.managerId, this.token).subscribe({
      next: (data: any) => {
        this.employees = Array.isArray(data) ? data : [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load team members!';
        this.isLoading = false;
      }
    });
  }

  loadReports(): void {
    this.employeeService.getReportsByManager(this.managerId, this.token).subscribe({
      next: (data: any) => this.reports = Array.isArray(data) ? data : [],
      error: () => this.errorMessage = 'Failed to load reports.'
    });
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    this.employeeService.uploadFile(file, this.token).subscribe({
      next: (res: any) => {
        this.fileUrl = res.url;
        this.successMessage = 'File uploaded successfully!';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'File upload failed.';
        this.successMessage = '';
      }
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.reportType || !this.fileUrl || (!this.editingReportId && !this.selectedEmployeeId)) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.isSubmitting = true;

    if (this.editingReportId) {
      const formData = new FormData();
      formData.append('reportType', this.reportType);

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      } else {
        formData.append('fileUrl', this.fileUrl);
      }

      this.employeeService.updateReport(this.editingReportId, formData, this.token).subscribe({
        next: () => {
          this.successMessage = 'Report updated successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadReports();
          this.isSubmitting = false;
        },
        error: (err: any) => {
          this.errorMessage = err?.error || 'Failed to update report.';
          this.successMessage = '';
          this.isSubmitting = false;
        }
      });
    } else {
      const payload = {
        targetEmployeeId: this.selectedEmployeeId,
        reportType: this.reportType,
        fileUrl: this.fileUrl,
        generatedOn: new Date().toISOString()
      };

      this.employeeService.createReport(payload, this.token).subscribe({
        next: () => {
          this.successMessage = 'Report submitted successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadReports();
          this.isSubmitting = false;
        },
        error: (err: any) => {
          this.errorMessage = err?.error || 'Failed to submit report.';
          this.successMessage = '';
          this.isSubmitting = false;
        }
      });
    }
  }

  editReport(report: any): void {
    this.selectedEmployeeId = report.targetEmployeeId;
    this.reportType = report.reportType;
    this.fileUrl = report.fileUrl;
    this.editingReportId = report.reportId;
  }

  deleteReport(reportId: string): void {
    this.employeeService.deleteReport(reportId, this.token).subscribe({
      next: () => {
        this.errorMessage = '';                                   
        this.successMessage = 'Report deleted successfully.';
        this.reports = this.reports.filter(r => r.reportId !== reportId); // remove instantly
        setTimeout(() => (this.successMessage = ''), 3000);        // optional auto-hide
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Failed to delete report.';
      }
    });
  }

  resetForm(): void {
    this.selectedEmployeeId = '';
    this.reportType = '';
    this.fileUrl = '';
    this.selectedFile = null;
    this.editingReportId = null;
  }

  downloadReport(reportId: number, fileName: string): void {
    this.employeeService.downloadReport(reportId, this.token).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.errorMessage = 'Failed to download file.';
        this.successMessage = '';
      }
    });
  }
}
