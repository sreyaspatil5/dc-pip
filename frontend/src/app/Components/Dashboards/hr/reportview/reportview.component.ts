import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportview.component.html',
  styleUrls: ['./reportview.component.scss']
})
export class ReportviewComponent implements OnInit {
  reports: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    const token = localStorage.getItem('token') || '';
    this.loading = true;

    this.employeeService.getAllReports(token).subscribe({
      next: (data) => {
        this.reports = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.error = 'Failed to load reports';
        this.loading = false;
      }
    });
  }

  deleteReport(reportId: string): void {
    const token = localStorage.getItem('token') || '';
    if (!confirm('Are you sure you want to delete this report?')) return;

    this.employeeService.deleteReport(reportId, token).subscribe({
      next: () => {
        this.reports = this.reports.filter((r) => r.id !== reportId);
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete report.');
      }
    });
  }

  downloadReport(fileUrl: string, fileName: string): void {
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = fileName || 'report.pdf';
    anchor.target = '_blank';
    anchor.click();
  }
}
