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
}