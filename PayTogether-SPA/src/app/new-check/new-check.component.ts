import { Component, OnInit } from '@angular/core';
import { FriendService } from '../_services/friend.service';
import { User } from '../_models/User';

@Component({
  selector: 'app-new-check',
  templateUrl: './new-check.component.html',
  styleUrls: ['./new-check.component.css']
})
export class NewCheckComponent implements OnInit {

  model: any = {};
  friends: any;
  constructor(private friendService: FriendService, public loggedUser: User) { }

  ngOnInit() {
    this.friendService.getFriends(this.loggedUser.ui).subscribe((data) => {
      this.friends = data;
      console.log(data);
    }, err => {
      console.log(err);
    })
  }
  submitData(){
console.log(this.model);
  }
}
