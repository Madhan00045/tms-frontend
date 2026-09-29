import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface MenuItem {
  id: number;
  code: string;
  name: string;
  route: string;
  icon: string;
  type: string;
  displayOrder: number;
  parentMenuId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: string[] = [];
  private menuItems: MenuItem[] = [];

  private readonly PERMISSIONS_STORAGE_KEY = 'userPermissions';
  private readonly MENU_STORAGE_KEY = 'userMenu';

  constructor(private http: HttpClient) {
    this.restorePermissions();
  }

  private restorePermissions(): void {
    const storedPerms = sessionStorage.getItem(this.PERMISSIONS_STORAGE_KEY);
    if (storedPerms) {
      try {
        this.permissions = JSON.parse(storedPerms);
      } catch {
        this.permissions = [];
      }
    }

    const storedMenu = sessionStorage.getItem(this.MENU_STORAGE_KEY);
    if (storedMenu) {
      try {
        this.menuItems = JSON.parse(storedMenu);
      } catch {
        this.menuItems = [];
      }
    }
  }

  loadPermissions(): Observable<string[]> {
    return this.http.get<string[]>('/api/permissions').pipe(
      tap((perms) => {
        this.permissions = Array.isArray(perms) ? perms : [];
        sessionStorage.setItem(this.PERMISSIONS_STORAGE_KEY, JSON.stringify(this.permissions));
      })
    );
  }

  loadMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>('/api/menu').pipe(
      tap((items) => {
        this.menuItems = Array.isArray(items) ? items : [];
        sessionStorage.setItem(this.MENU_STORAGE_KEY, JSON.stringify(this.menuItems));
      })
    );
  }

  has(functionalityCode: string): boolean {
    if (!functionalityCode) return false;
    return this.permissions.includes(functionalityCode.trim().toUpperCase());
  }

  hasAny(codes: string[]): boolean {
    if (!codes || codes.length === 0) return false;
    return codes.some(code => this.has(code));
  }

  getPermissions(): string[] {
    return [...this.permissions];
  }

  getMenu(): MenuItem[] {
    return [...this.menuItems];
  }

  clearPermissions(): void {
    this.permissions = [];
    this.menuItems = [];
    sessionStorage.removeItem(this.PERMISSIONS_STORAGE_KEY);
    sessionStorage.removeItem(this.MENU_STORAGE_KEY);
  }
}
