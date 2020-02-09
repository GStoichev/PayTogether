import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:8000/';
  constructor(private http: HttpClient) { }

  login(model: any) {
    console.log(model);
    const headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post(this.baseUrl + 'login', model, {headers});
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers.append('Content-Type', 'application/json');
  }

  register(model: any){
    return this.http.post(this.baseUrl + 'register', model);
  }
}

