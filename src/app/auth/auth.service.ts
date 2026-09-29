import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/secure-test';

  constructor(private http: HttpClient) {}

  testProtectedApi(): Observable<string> {
    return this.http.get(this.apiUrl, {
      responseType: 'text'
    });
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;
      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    const payload = this.getDecodedToken();
    return payload ? payload.role || null : null;
  }

  getUsername(): string | null {
    const payload = this.getDecodedToken();
    return payload ? payload.sub || null : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isDispatcher(): boolean {
    return this.getUserRole() === 'DISPATCHER';
  }

  isCustomer(): boolean {
    return this.getUserRole() === 'CUSTOMER';
  }

  canAccessDashboard(): boolean {
    return this.isAdmin() || this.isDispatcher();
  }

  canAccessLoadList(): boolean {
    return this.isAdmin() || this.isDispatcher();
  }

  canCreateLoad(): boolean {
    return this.isAdmin() || this.isDispatcher() || this.isCustomer();
  }

  canEditLoad(): boolean {
    return this.isAdmin() || this.isDispatcher();
  }

  canDeleteLoad(): boolean {
    return this.isAdmin() || this.isDispatcher();
  }

  canUpdateLoadStatus(): boolean {
    return this.isAdmin() || this.isDispatcher();
  }

  canAccessCustomers(): boolean {
    return this.isAdmin();
  }

  canAccessCarriers(): boolean {
    return this.isAdmin();
  }
}