import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  model: any = {}
  registerForm: FormGroup;

  @Output() eventEmitter = new EventEmitter();


  constructor(private accountService: AccountService, private toast: ToastrService,
    private router: Router, private fb: FormBuilder, private memberService:MemberService) { }

  ngOnInit(): void {
    this.initRegisterFrom()

    this.registerForm.controls["password"].valueChanges.subscribe(() => {
      this.registerForm.controls["confirmPassword"].updateValueAndValidity();
    })


  }
  initRegisterFrom() {
    this.registerForm = this.fb.group({
      username: ['hello', Validators.required],
      gender: ['female'],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      knownAs: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      confirmPassword: ['', [Validators.required, this.matchValue("password")]]
    })
  }

  matchValue(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true }
    }
  }


  cancel() {
    this.eventEmitter.emit(false)
  }
  register() {
    console.log(this.registerForm);
    this.accountService.register(this.registerForm.value).subscribe(data => {
      console.log(data);
      this.router.navigateByUrl("/members");
    }, error => {
      console.log(error);
      if (error[0])
        this.toast.error(error[0]);
      if (error[1])
        this.toast.error(error[1]);


    })
  }
}
