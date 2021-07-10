import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/interfaces/Member';
import { User } from 'src/app/interfaces/User';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: User;
  member: Member;
  @ViewChild("form") form: NgForm;
  @HostListener("window:beforeunload", ["$event"]) unloadNotification($event) {
    if (this.form.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService, private memberService: MemberService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadMember();

  }

  loadMember() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
    this.memberService.getMember(this.user.userName).subscribe(member => {
      this.member = member;
    })
  }

  editMember(form: NgForm) {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toaster.success("Changes Saved");
      form.reset(this.member);
    })





  }

}
