import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Friend } from '../_models/friend';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  baseUrl = 'http://localhost:8080/';
  constructor(private http: HttpClient) { }

  getFriends(user): Observable<Friend[]> {
    return this.http.post<Friend[]>(this.baseUrl + 'friend/friends', user);
  }

  getFriend(id,user): Observable<Friend> {
    return this.http.post<Friend>(this.baseUrl + 'friend/' + id, user);
  }

  // addFriend(id,user): Observable<Friend> {
  //   return this.http.post<Friend>(this.baseUrl + 'friend/' + id, user);
  // }

}
