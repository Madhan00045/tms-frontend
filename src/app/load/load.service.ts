import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoadRequest {
  loadNumber: string;
  customerId: number;
  carrierId: number;
  bolNumber: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  deliveryDate: string;
  weight: number;
  pieces: number;
  status: string;
}
export interface Load {
  id: number;
  load_number: string;
  customer_name: string;
  carrier_name: string;
  bol_number: string;
  pickup_location: string;
  delivery_location: string;
  pickup_date: string;
  delivery_date: string;
  weight: number;
  pieces: number;
  status: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  private apiUrl = '/api/loads';

  constructor(private http: HttpClient) {}

  createLoad(load: LoadRequest): Observable<string> {
    return this.http.post(this.apiUrl, load, {
      responseType: 'text'
    });
  }
//   getLoads(): Observable<Load[]> {
//      return this.http.get<Load[]>(this.apiUrl);
//  }
 getLoads(page: number, size: number) {
  return this.http.get<any>(
    `/api/loads?page=${page}&size=${size}`
  );
}

  updateLoadStatus(id: number, status: string): Observable<string> {
    return this.http.put(
      `${this.apiUrl}/${id}/status`,
      { status: status },
      {
        responseType: 'text'
      }
    );
  }
}