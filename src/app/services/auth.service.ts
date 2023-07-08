import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Ubah sesuai dengan URL backend Anda

  constructor(private http: HttpClient) { }

  private username: string = '';

  setUsername(username: string) {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  logout() {
    return this.http.get(`http://localhost:3000/logout`);
  }

  register(name: string, gender: string, phone: string, email: string, username: string, password: string): Observable<any> {
    const body = { name, gender, phone, email, username, password };
    return this.http.post(`${this.apiUrl}/register`, body);
  }
}
