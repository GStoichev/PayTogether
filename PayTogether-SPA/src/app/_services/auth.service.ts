import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:8000/login';
  constructor(private http: HttpClient) { }

  login(model: any) {
    console.log(model);
    const headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post(this.baseUrl, model, {headers});
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers.append('Content-Type', 'application/json');
  }
}

