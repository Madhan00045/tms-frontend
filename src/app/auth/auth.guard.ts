import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { PermissionService } from './permission.service';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private permissionService: PermissionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const payload = this.authService.getDecodedToken();

      if (!payload) {
        localStorage.removeItem('jwtToken');
        this.permissionService.clearPermissions();
        this.router.navigate(['/login']);
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem('jwtToken');
        this.permissionService.clearPermissions();
        this.router.navigate(['/login']);
        return false;
      }

      // If permissions are not yet in memory or storage, fetch them from database
      if (this.permissionService.getPermissions().length === 0) {
        return this.permissionService.loadPermissions().pipe(
          tap(() => this.permissionService.loadMenu().subscribe()),
          map(() => this.evaluateRouteAccess(route)),
          catchError(() => {
            return of(this.evaluateRouteAccess(route));
          })
        );
      }

      return this.evaluateRouteAccess(route);

    } catch (error) {
      localStorage.removeItem('jwtToken');
      this.permissionService.clearPermissions();
      this.router.navigate(['/login']);
      return false;
    }
  }

  private evaluateRouteAccess(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data && route.data['permission'];
    if (requiredPermission) {
      if (this.permissionService.has(requiredPermission)) {
        return true;
      }
      this.redirectToPermittedRoute();
      return false;
    }

    return true;
  }

  private redirectToPermittedRoute(): void {
    if (this.permissionService.has('DASHBOARD')) {
      this.router.navigate(['/dashboard']);
    } else if (this.permissionService.has('LOAD_LIST')) {
      this.router.navigate(['/loads']);
    } else if (this.permissionService.has('CREATE_LOAD')) {
      this.router.navigate(['/loads/create']);
    } else if (this.permissionService.has('TRACKING')) {
      this.router.navigate(['/tracking']);
    } else if (this.permissionService.has('CUSTOMERS')) {
      this.router.navigate(['/customers']);
    } else if (this.permissionService.has('CARRIERS')) {
      this.router.navigate(['/carriers']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}