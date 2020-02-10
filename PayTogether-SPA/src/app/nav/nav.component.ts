import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { User } from '../_models/User';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  username: string;
  logged = false;
  constructor( public loggedUser: User, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  login() {
    this.authService.login(this.model).subscribe(user => {
      this.loggedUser.ui = user;
      this.logged = true;
      localStorage.setItem('Logged', 'true');
      localStorage.setItem('username', user.name_); // this.loggedUser.ui.name_);
      this.username = localStorage.getItem('username');
      // console.log('Successfully logged in', this.loggedUser);
      this.router.navigate(['/check-list']);
    }, error => {
      console.log('Failed to login', error);
      this.logged = false;
    });
  }

  loggedIn() {
    return (!!localStorage.getItem('Logged') && localStorage.getItem('Logged') === 'true');
  }

  logOut() {
    this.logged = false;
    localStorage.removeItem('Logged');
    localStorage.removeItem('username');
    this.router.navigate(['/home']);
  }

}
