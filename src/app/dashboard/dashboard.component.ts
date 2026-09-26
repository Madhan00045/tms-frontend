import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardSummary } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  summary: DashboardSummary = {
    total_loads: 0,
    created_loads: 0,
    in_transit_loads: 0,
    delivered_loads: 0
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => {
        console.error('Failed to load dashboard summary:', error);
      }
    });
  }
}