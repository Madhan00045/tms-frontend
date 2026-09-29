import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: number;
  customerCode: string;
  companyName: string;
  contactName?: string;
  phone?: string;
  email?: string;
}

export interface CustomerRequest {
  customerCode: string;
  companyName: string;
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
export class CustomerService {

  private apiUrl = '/api/customers';

  constructor(private http: HttpClient) {}

  // Used by Create Load dropdown
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomersLookup() {
  return this.http.get<any[]>('/api/customers/lookup');
}

  // Used by Customer List with server-side pagination, search, and up to 3 filters
  getCustomersPaginated(
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

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: CustomerRequest): Observable<string> {
    return this.http.post(this.apiUrl, customer, {
      responseType: 'text'
    });
  }

  updateCustomer(id: number, customer: CustomerRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, customer, {
      responseType: 'text'
    });
  }

  deleteCustomer(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }
}