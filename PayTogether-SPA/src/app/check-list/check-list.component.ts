import { Component, OnInit, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { Check } from '../_models/check';
import { CheckService } from '../_services/check.service';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css']
})
export class CheckListComponent implements OnInit {

  checks: any;
  addAddInput = false;

  constructor(public loggedUser: User, private checkService: CheckService, private router: Router) {
  }

  ngOnInit() {
    this.checkService.getChecks(this.loggedUser.ui).subscribe((checks) => {
      console.log('The checks: ', checks);
      this.checks = checks;
      // this.checks = this.checks.forEach(element => {

      // });
    }, error => {
      console.log(error);
    });

  }

  addInput() {
    this.addAddInput = !this.addAddInput;
  }

  deleteCheck(data) {
    this.checkService.deleteCheck(data).subscribe(() => {
      this.router.navigate(['/check-list']);
    }, err => {
      console.log(err);
    });
  }
}
