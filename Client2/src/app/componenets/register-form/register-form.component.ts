import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  model: any = {}
  @Output() eventEmitter = new EventEmitter();
  constructor(private accountService: AccountService, private toast: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
  }


  cancel() {
    this.eventEmitter.emit(false)
  }
  register() {
    console.log(this.model);
    this.accountService.register(this.model).subscribe(data => {
      console.log(data);
      this.router.navigateByUrl("/members");

    }, error => {
      this.toast.error(error.error);
      this.toast.error(error.error);

    })
  }
}
