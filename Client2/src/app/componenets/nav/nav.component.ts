import { Component, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  model: any = {};


  constructor(public accountService: AccountService) {

  }

  ngOnInit(): void {
  }


  logOut() {
    this.accountService.logOut();
  }

  login(): void {
    this.accountService.login(this.model).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);

    })

  }



}
