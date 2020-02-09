import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UI } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:8080/';
  constructor(private http: HttpClient) { }

  login(model: any) {
    console.log(model);
    const headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post<UI>(this.baseUrl + 'login', model, {headers});
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers.append('Content-Type', 'application/json');
  }

  register(model: any){
    return this.http.post(this.baseUrl + 'register', model);
  }

  loggedIn() {
    const token = localStorage.getItem('Logged');
    return !!token;
  }

}

