import { Component, OnInit, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { Check } from '../_models/check';
import { CheckService } from '../_services/check.service';
import { User } from '../_models/User';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css']
})
export class CheckListComponent implements OnInit {

  checks: Check[];

  constructor( public loggedUser: User, private checkService: CheckService) { 
    console.log('logging',this.loggedUser);
  }

  ngOnInit() {
    this.loadChecks();
  }

  loadChecks() {
    console.log('user: ', this.loggedUser);
    this.checkService.getChecks(this.loggedUser.ui).subscribe((checks) => {
      console.log('The checks: ', checks);
    }, error => {
      console.log(error);
    });
  }

}
