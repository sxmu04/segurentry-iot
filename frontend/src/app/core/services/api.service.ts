import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAccessLogs() {
    return this.http.get(`${this.API_URL}/access`);
  }

  registerAccess(data: any) {
    return this.http.post(`${this.API_URL}/access/register/`, data);
  }
}