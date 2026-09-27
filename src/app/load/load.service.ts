import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  paymentStatus?: string;
}

export interface UpdateLoadRequest {
  status: string;
  paymentStatus: string;
}

export interface EditLoadInfoRequest {
  customerId: number;
  carrierId: number;
  bolNumber: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  deliveryDate: string;
  weight: number;
  pieces: number;
}

export interface Load {
  id: number;
  load_number: string;
  customer_id?: number;
  customer_name: string;
  carrier_id?: number;
  carrier_name: string;
  bol_number: string;
  pickup_location: string;
  delivery_location: string;
  pickup_date: string;
  delivery_date: string;
  weight: number;
  pieces: number;
  status: string;
  payment_status?: string;
  paymentStatus?: string;
  created_at: string;
}

export interface FilterItem {
  field: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  private apiUrl = '/api/loads';

  constructor(private http: HttpClient) {}

  createLoad(load: LoadRequest): Observable<any> {
    return this.http.post(this.apiUrl, load);
  }

  getLoads(
    page: number,
    size: number,
    search?: string,
    filters?: FilterItem[] | { [key: string]: string } | string,
    legacyFilterValue?: string
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
    } else if (typeof filters === 'object' && filters !== null) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (key && value && value.trim()) {
          params = params.set(key.trim(), value.trim());
          params = params.append('filterField', key.trim()).append('filterValue', value.trim());
        }
      });
    } else if (typeof filters === 'string' && filters.trim() && legacyFilterValue && legacyFilterValue.trim()) {
      params = params.set(filters.trim(), legacyFilterValue.trim());
      params = params.append('filterField', filters.trim()).append('filterValue', legacyFilterValue.trim());
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getLoadById(id: number): Observable<Load> {
    return this.http.get<Load>(`${this.apiUrl}/${id}`);
  }

  updateLoadInfo(id: number, request: EditLoadInfoRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, request, {
      responseType: 'text'
    });
  }

  updateLoad(id: number, request: UpdateLoadRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, request, {
      responseType: 'text'
    });
  }

  deleteLoad(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }

  updateLoadStatus(id: number, status: string, remarks?: string): Observable<string> {
    const body: any = { status };
    if (remarks) {
      body.remarks = remarks;
    }
    return this.http.put(
      `${this.apiUrl}/${id}/status`,
      body,
      {
        responseType: 'text'
      }
    );
  }

  updatePaymentStatus(id: number, paymentStatus: string): Observable<string> {
    return this.http.put(
      `${this.apiUrl}/${id}/payment-status`,
      { paymentStatus },
      {
        responseType: 'text'
      }
    );
  }
}