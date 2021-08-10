import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/interfaces/Member';
import { PaginatedResult, Pagination } from 'src/app/interfaces/models/Paginations';
import { User } from 'src/app/interfaces/User';
import { UserParams } from 'src/app/interfaces/userParams';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  user: User;
  pagination: Pagination;
  totalPages: Array<any> = [];
  userParams: UserParams;
  GenderOptions = [{ show: "Males", value: "male" }, { show: "Females", value: "female" }];
  constructor(private memberService: MemberService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });

    this.userParams = this.memberService.userParams;

    this.loadMembers(false);
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    this.loadMembers(true);
  }

  onOrderedByAction(orderedBy: string) {
    this.userParams.orderedBy = orderedBy;
    this.loadMembers(false);

  }

  loadMembers(isFromForm) {
    this.memberService.userParams = this.userParams;
    if (isFromForm)
      this.userParams.pageNumber = 1
    this.memberService.getMembers(this.userParams).subscribe(pagResponse => {
      this.pagination = pagResponse.pagination;
      this.members = pagResponse.result;
      console.log(this.members[0].userName);

      this.totalPages = new Array(this.pagination.totalPages);
    })
  }
  getMembers(pageNumber: number, pageSize: number) {
    if (pageNumber > this.pagination.totalPages || pageNumber < 1 || pageNumber == this.userParams.pageNumber) return;
    this.userParams.pageNumber = pageNumber;
    this.userParams.pageSize = pageSize;
    this.loadMembers(false);

  }
}
