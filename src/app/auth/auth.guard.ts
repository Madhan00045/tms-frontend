import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const payload = this.authService.getDecodedToken();

      if (!payload) {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/login']);
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/login']);
        return false;
      }

      // Check role permissions if specified in route data
      const expectedRoles: string[] = route.data && route.data['roles'];
      if (expectedRoles && expectedRoles.length > 0) {
        const userRole = this.authService.getUserRole();
        if (!userRole || !expectedRoles.includes(userRole)) {
          // Insufficient role: redirect to permitted landing page
          if (userRole === 'CUSTOMER') {
            this.router.navigate(['/loads/create']);
          } else {
            this.router.navigate(['/dashboard']);
          }
          return false;
        }
      }

      return true;

    } catch (error) {
      localStorage.removeItem('jwtToken');
      this.router.navigate(['/login']);
      return false;
    }
  }
}