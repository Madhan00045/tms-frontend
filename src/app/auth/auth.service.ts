import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/secure-test';

  constructor(
    private http: HttpClient,
    private permissionService: PermissionService
  ) {}

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
    return this.permissionService.has('DASHBOARD');
  }

  canAccessLoadList(): boolean {
    return this.permissionService.has('LOAD_LIST');
  }

  canCreateLoad(): boolean {
    return this.permissionService.has('CREATE_LOAD');
  }

  canEditLoad(): boolean {
    return this.permissionService.has('EDIT_LOAD');
  }

  canDeleteLoad(): boolean {
    return this.permissionService.has('DELETE_LOAD');
  }

  canUpdateLoadStatus(): boolean {
    return this.permissionService.has('UPDATE_LOAD_STATUS');
  }

  canAccessCustomers(): boolean {
    return this.permissionService.has('CUSTOMERS');
  }

  canAccessCarriers(): boolean {
    return this.permissionService.has('CARRIERS');
  }
}