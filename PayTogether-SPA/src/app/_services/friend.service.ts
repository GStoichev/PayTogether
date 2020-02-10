import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  baseUrl = 'http://localhost:8080/';
  constructor(private http: HttpClient) { }

  getFriends(user): Observable<User[]> {
    return this.http.post<User[]>(this.baseUrl + 'friend/friends', user);
  }

  // getFriend(id,user): Observable<Friend> {
  //   return this.http.post<Friend>(this.baseUrl + 'friend/' + id, user);
  // }

  addFriend(id,user): Observable<User> {
    console.log(JSON.stringify(user));
    return this.http.post<User>(this.baseUrl + 'friend/add', { user , id});
  }

}
