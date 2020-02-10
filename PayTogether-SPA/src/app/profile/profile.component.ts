import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { ProfileService } from '../_services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  constructor( public loggedUser: User, private profileService: ProfileService) {
  }

  ngOnInit() {
    // this.profileService.getFriends(this.loggedUser.ui).subscribe((friends) => {
    //   console.log('The Friends: ', friends);
    //   this.friends = friends;
    // }, error => {
    //   console.log(error);
    // });
  }

}
