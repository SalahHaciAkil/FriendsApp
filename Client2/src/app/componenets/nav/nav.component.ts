import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  model: any = {};


  constructor(public accountService: AccountService,
    private router: Router, private toast: ToastrService) {

  }

  ngOnInit(): void {
  }


  logOut() {
    this.accountService.logOut();
    this.router.navigateByUrl("/");

  }

  login(): void {
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl("/members");
      this.toast.success("Successful Login");


    }, error => {
      console.log(error);
      this.toast.error(error.error);

    })

  }



}
