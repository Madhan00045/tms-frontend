import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  total_loads: number;
  created_loads: number;
  in_transit_loads: number;
  delivered_loads: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = '/api/dashboard/summary';

  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(this.apiUrl);
  }
}