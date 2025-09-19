import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css']
})
export class ManagersComponent implements OnInit {
  managerList: any[] = [];
  filteredManagers: any[] = [];
  selectedManager: any = null;
  viewTeam: boolean = false;
  token: string | null = null;

  searchQuery: string = '';
  teamSizeFilter: string = '';

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.loadManagers();
    }
  }

  loadManagers(): void {
    this.empService.getEmployeesByRole('MANAGER', this.token!)
      .subscribe({
        next: (res) => {
          this.managerList = res;
          this.filteredManagers = [...res];
        },
        error: (err) => console.error('❌ Manager list error:', err)
      });
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const size = this.teamSizeFilter;

    this.filteredManagers = this.managerList.filter(manager => {
      const matchesQuery =
        manager.name.toLowerCase().includes(query) ||
        manager.department.toLowerCase().includes(query);

      const matchesSize =
        !size ||
        (size === '1-5' && manager.teamSize >= 1 && manager.teamSize <= 5) ||
        (size === '6-10' && manager.teamSize >= 6 && manager.teamSize <= 10) ||
        (size === '10+' && manager.teamSize > 10);

      return matchesQuery && matchesSize;
    });
  }

  showTeam(manager: any): void {
    if (!manager.id) {
      console.error('❌ Manager ID missing! Cannot fetch team.');
      return;
    }

    this.empService.getTeam(manager.id, this.token!)
      .subscribe({
        next: (res) => {
          this.selectedManager = { ...manager, team: res };
          this.viewTeam = true;
        },
        error: (err) => console.error('❌ Team fetch error:', err)
      });
  }

  backToOverview(): void {
    this.selectedManager = null;
    this.viewTeam = false;
  }

  viewManagerDetails(manager: any): void {
    alert(`🧾 Manager Info:\nName: ${manager.name}\nDepartment: ${manager.department}\nTeam Size: ${manager.teamSize}`);
  }
}
