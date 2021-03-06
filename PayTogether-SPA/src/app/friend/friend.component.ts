import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { FriendService } from '../_services/friend.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  friends: any;
  friendId: string;
  
  constructor( public loggedUser: User, private friendService: FriendService) {
  }

  ngOnInit() {
    this.friendService.getFriends(this.loggedUser.ui).subscribe((friends) => {
      console.log('The Friends: ', friends);
      this.friends = friends;
    }, error => {
      console.log(error);
    });
  }

  addFriend() {
    
    this.friendService.addFriend(this.friendId,this.loggedUser.ui).subscribe(user => {
      console.log('Added succesfuly');
    }, error => {
      console.log('Failed to add friend', error); 
    });
  }

}
