import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { LoginComponent } from "./Components/login/login.component";

import { HeroComponent } from './Components/hero/hero.component';

import { CommonModule } from '@angular/common';

import { EmpdashboardComponent } from './Components/Dashboards/empdashboard/empdashboard.component';

import { Router } from '@angular/router';

import { AssignManagerComponent } from './Components/Dashboards/hr/assign-manager/assign-manager.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { NotificationBellComponent } from './Components/notification-bell/notification-bell.component';

 
@Component({

  selector: 'app-root',

  standalone: true,

  imports: [

    RouterOutlet,

    LoginComponent,

    HeroComponent,

    CommonModule,

    AssignManagerComponent,

    EmpdashboardComponent,

    NotificationBellComponent,

    RouterOutlet

  ],

  templateUrl: './app.component.html',

  styleUrls: ['./app.component.css'],  // fixed typo here

  providers: [

    {

      provide: HTTP_INTERCEPTORS,

      useClass: AuthInterceptor,

      multi: true

    }

  ]

})

export class AppComponent {

  title = 'PIP_Tracker';

  showLogin = false;
 
  constructor(private router: Router) {}
 
  displayLogin() {

    this.showLogin = true;

  }
 
  closeLogin() {

    this.showLogin = false;

  }
 
  handleLogin(role: string) {

    this.showLogin = false; // 👈 This hides the login before navigating

    if (role === 'employee') {

      this.router.navigate(['/empdashboard']);

    } else if (role === 'manager') {

      this.router.navigate(['/managerdashboard']);

    } else if (role === 'admin') {

      this.router.navigate(['/admindashboard']);

    }

  }

}

 