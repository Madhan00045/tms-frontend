import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = '/api/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {

    const body = {
      username: username,
      password: password
    };

    return this.http.post<any>(
      this.apiUrl,
      body
    );
  }
}