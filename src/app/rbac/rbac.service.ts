import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  description: string;
}

export interface Functionality {
  id: number;
  functionalityCode: string;
  functionalityName: string;
  functionalityType?: string;
  parentFunctionalityId?: number;
  routeUrl?: string;
  description?: string;
  assigned: boolean;
}

export interface User {
  id: number;
  username: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RbacService {

  private baseUrl = '/api/rbac';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`);
  }

  getRoleFunctionalities(roleId: number): Observable<Functionality[]> {
    return this.http.get<Functionality[]>(`${this.baseUrl}/roles/${roleId}/functionalities`);
  }

  updateRoleFunctionalities(roleId: number, functionalityIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/roles/${roleId}/functionalities`, {
      functionalityIds
    });
  }

  getMappedUsers(roleId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/roles/${roleId}/users`);
  }

  getUnmappedUsers(roleId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/roles/${roleId}/unmapped-users`);
  }

  assignUserToRole(roleId: number, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/roles/${roleId}/users/${userId}`, {});
  }

  removeUserFromRole(roleId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/roles/${roleId}/users/${userId}`);
  }
}
