import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { User } from 'src/app/interfaces/User';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  model: any = {};
  user: User;

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
      // this.user = response;
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user;
      })

      console.log(this.user);
      


    }, error => {
      // console.log(error);
      // this.toast.error(error.error);

    })

  }



}
