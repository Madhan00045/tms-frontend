import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Carrier {
  id: number;
  carrierCode: string;
  carrierName: string;
  contactName?: string;
  phone?: string;
  email?: string;
}

export interface CarrierRequest {
  carrierCode: string;
  carrierName: string;
  contactName?: string;
  phone?: string;
  email?: string;
}

export interface FilterItem {
  field: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarrierService {

  private apiUrl = '/api/carriers';

  constructor(private http: HttpClient) {}

  // Used by Create Load dropdown
  getCarriers(): Observable<Carrier[]> {
    return this.http.get<Carrier[]>(this.apiUrl);
  }

  // Used by Carrier List with server-side pagination, search, and up to 3 filters
  getCarriersPaginated(
    page: number,
    size: number,
    search?: string,
    filters?: FilterItem[]
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    if (Array.isArray(filters)) {
      filters.forEach((f) => {
        if (f.field && f.field.trim() && f.value && f.value.trim()) {
          const field = f.field.trim();
          const value = f.value.trim();
          params = params.set(field, value);
          params = params.append('filterField', field).append('filterValue', value);
        }
      });
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getCarrierById(id: number): Observable<Carrier> {
    return this.http.get<Carrier>(`${this.apiUrl}/${id}`);
  }

  createCarrier(carrier: CarrierRequest): Observable<string> {
    return this.http.post(this.apiUrl, carrier, {
      responseType: 'text'
    });
  }

  updateCarrier(id: number, carrier: CarrierRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, carrier, {
      responseType: 'text'
    });
  }

  deleteCarrier(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }
}