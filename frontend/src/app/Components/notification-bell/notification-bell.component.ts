import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css'
})
export class NotificationBellComponent implements OnInit, OnDestroy {
getNotificationTitle(arg0: any): any {
throw new Error('Method not implemented.');
}
  notifications: any[] = [];
  dropdownOpen: boolean = false;
  private subscription!: Subscription;
  private autoDismissTimer: any;
  private notificationSound: HTMLAudioElement;
  userId: string = '';

  constructor(private employeeService: EmployeeService) {
    this.notificationSound = new Audio('assets/sounds/ping.mp3.wav');
    this.notificationSound.load();
  }

  ngOnInit() {
    const payload = this.employeeService.decodeUserFromToken();
    this.userId = payload?.sub || '';
    const token = localStorage.getItem('token') || '';

    if (this.userId && token) {
      this.employeeService.connectWebSocket(this.userId, token);

      this.employeeService.getNotificationsByEmail(this.userId, token).subscribe((storedNotifications) => {
        this.notifications = storedNotifications || [];
      });

      this.subscription = this.employeeService.notifications$.subscribe((notification) => {
        this.notifications.unshift(notification);
        this.playNotificationSound();
      });
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;

    if (this.dropdownOpen) {
      this.autoDismissTimer = setTimeout(() => {
        this.dropdownOpen = false;
        this.notifications = []; // ✅ Clear notifications after 10 sec
      }, 10000);
    } else {
      clearTimeout(this.autoDismissTimer);
    }
  }

  private playNotificationSound(): void {
    this.notificationSound.currentTime = 0;
    this.notificationSound.play().catch(err => {
      console.warn('🔇 Unable to play notification sound:', err);
    });
  }

  ngOnDestroy() {
    this.employeeService.disconnectWebSocket();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    clearTimeout(this.autoDismissTimer);
  }
}
