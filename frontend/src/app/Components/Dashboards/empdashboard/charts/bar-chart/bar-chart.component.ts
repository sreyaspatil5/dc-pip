import { Component,AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';

import {
  ChartData,
  ChartOptions
} from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements AfterViewInit{
  ngAfterViewInit(): void {
     const ctx = document.getElementById('myChart') as HTMLCanvasElement;

     new Chart(ctx, {
       type: 'bar',
       data: {
         labels: ['Jan', 'Feb', 'Mar', 'Apr'],
         datasets: [{
           label: 'Employees',
           data: [30, 45, 60, 75],
           backgroundColor: '#4f46e5',
         }],
       },
       options: {
         responsive: true,
         plugins: {
           title: {
             display: true,
             text: 'Employees Over Months'
           }
         }
       }
     });
   }
}
