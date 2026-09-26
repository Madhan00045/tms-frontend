import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    const token = localStorage.getItem('jwtToken');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/login']);
        return false;
      }

      return true;

    } catch (error) {
      localStorage.removeItem('jwtToken');
      this.router.navigate(['/login']);
      return false;
    }
  }
}