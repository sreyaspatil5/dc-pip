import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  
  isMobileMenuOpen: boolean = false; 

  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) {}

  onLoginClick() {
    this.router.navigate(['/login']);
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}