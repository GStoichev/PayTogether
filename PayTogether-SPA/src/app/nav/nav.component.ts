import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  logged = false;
  user: any;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = localStorage.getItem('username');
  }

  login() {
    this.authService.login(this.model).subscribe(user => {
      console.log('Successfully logged in', user);
      this.logged = true;
      localStorage.setItem('Logged', 'true');
      localStorage.setItem('username', user['name_']);
      this.user = localStorage.getItem('username');
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
  }

}
