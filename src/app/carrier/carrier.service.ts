import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Carrier {
  id: number;
  carrierCode: string;
  carrierName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarrierService {

  private apiUrl = '/api/carriers';

  constructor(private http: HttpClient) {}

  getCarriers(): Observable<Carrier[]> {
    return this.http.get<Carrier[]>(this.apiUrl);
  }
}