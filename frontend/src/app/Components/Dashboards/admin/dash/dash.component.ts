import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Import this

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule], // ✅ Add this line
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent {

  constructor(private router: Router) {}

  report = {
    totalEmployees: 0,
    totalHRs: 0,
    totalManagers: 0,
    totalAdmins: 0
  };

  departmentStats: { [key: string]: number } = {};
}
