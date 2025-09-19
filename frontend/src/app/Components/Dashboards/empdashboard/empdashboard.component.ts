import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { LearningResourcesComponent } from './learning-resources/learning-resources.component';
import { FeedbackNotesComponent } from './feedback-notes/feedback-notes.component';
import { SkillAnalyticsComponent } from "./skill-analytics/skill-analytics.component";
import { PerformanceReviewComponent } from "./performance-review/performance-review.component";
import { NotificationBellComponent } from '../../notification-bell/notification-bell.component';

@Component({
  selector: 'app-empdashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FeedbackNotesComponent,
    LearningResourcesComponent,
    SkillAnalyticsComponent,
    PerformanceReviewComponent,
    NotificationBellComponent
  ],
  templateUrl: './empdashboard.component.html',
  styleUrls: ['./empdashboard.component.css']
})
export class EmpdashboardComponent implements OnInit {

  isSidebarOpen: boolean = false;
  currentView: string = 'feedback';
  showLogoutToast: boolean = false;

  // ✅ Add this for personalized welcome
  employeeName: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ✅ Fetch employee name from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.employeeName = user.name || user.email || 'Employee';
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const segments = event.urlAfterRedirects.split('/');
        this.currentView = segments[segments.length - 1] || 'feedback';
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDarkMode(): void {
    const html = document.documentElement;
    html.classList.toggle('dark');
  }

  logout(): void {
    localStorage.clear();
    this.showLogoutToast = true;

    setTimeout(() => {
      this.showLogoutToast = false;
    }, 1800);

    setTimeout(() => {
      this.router.navigate(['/hero']);
    }, 2000);
  }
}
