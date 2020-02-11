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
  model: any = {};

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

  addNewValue(i, j, entity_id, friend_id, income,param) {
    // console.log(this.model['newValue' + i + '_' + j]);
    this.model.value = this.model['newValue' + i + '_' + j];
    this.model.entity_id = entity_id;
    console.log(income);
    this.model.friend_id1 = (income) ? friend_id : this.loggedUser.ui.id_;
    this.model.friend_id2 = (income) ? this.loggedUser.ui.id_ : friend_id;
    console.log(JSON.stringify(this.model));
    if(param===1){
    this.checkService.addToCheck(this.model).subscribe(() => {
      console.log('success');
    }, err => {
      console.log(err);
    });}
    if(param===2){ 
      this.checkService.payCheck(this.model).subscribe(() => {
      console.log('success');
    }, err => {
      console.log(err);
    });}
  }


  deleteCheck(data) {
    this.checkService.deleteCheck(data).subscribe(() => {
      this.router.navigate(['/check-list']);
    }, err => {
      console.log(err);
    });
  }
}
