import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  logged: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      console.log('Successfully logged in');
      localStorage.setItem('Logged', 'true');
      this.logged = true;
    }, error => {
      console.log('Failed to login', error);
      this.logged = false;
    });
  }

  loggedIn() {
    return (!!localStorage.getItem('Logged') && localStorage.getItem('Logged')==='true');
  }

  logOut(){
    this.logged = false;
    return localStorage.removeItem('Logged');

  }

}
