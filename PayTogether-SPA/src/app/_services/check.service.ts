import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Check } from '../_models/check';

@Injectable({
  providedIn: 'root'
})
export class CheckService {
  baseUrl = 'http://localhost:8080/';
  constructor(private http: HttpClient) { }

  getChecks(user): Observable<Check[]> {
    return this.http.post<Check[]>(this.baseUrl + 'home/checks', user);
  }

  getCheck(id,user): Observable<Check> {
    return this.http.post<Check>(this.baseUrl + 'checks/' + id, user);
  }

  addCheck(entity): Observable<Check> {
    return this.http.post<Check>(this.baseUrl + 'create', entity);
  }

}
