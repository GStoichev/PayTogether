import { Component, OnInit } from '@angular/core';
import { FriendService } from '../_services/friend.service';
import { User } from '../_models/User';
import { CheckService } from '../_services/check.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-check',
  templateUrl: './new-check.component.html',
  styleUrls: ['./new-check.component.css']
})
export class NewCheckComponent implements OnInit {

  model: any = {};
  friends: any;
  constructor(private friendService: FriendService, public loggedUser: User, private checkService: CheckService, public router: Router) { }

  ngOnInit() {
    this.friendService.getFriends(this.loggedUser.ui).subscribe((data) => {
      this.friends = data;
      console.log(data);
    }, err => {
      console.log(err);
    })
  }
  submitData() {
    this.model.user = this.loggedUser.ui.id_;
    this.checkService.addCheck(this.model).subscribe(() => {
      this.router.navigate(['/check-list']);
    });
  }
}
