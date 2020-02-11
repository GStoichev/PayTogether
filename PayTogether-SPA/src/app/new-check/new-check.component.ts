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
    let data: any = {
      entity: { name: this.model.name, description: this.model.description },
      participants: []
    };
    if (this.model.income == 'true') {
      console.log(1);
      data.participants.push({
        friend1: this.model.friend,
        friend2: this.loggedUser.ui.id_,
        money: this.model.money
      });
    }
    if (this.model.income == 'false') {
      console.log(2);
      data.participants.push({
        friend1: this.loggedUser.ui.id_,
        friend2: this.model.friend,
        money: this.model.money
      });
    }
    this.checkService.addCheck(data).subscribe(() => {
      this.router.navigate(['/check-list']);
    });
  }
}
