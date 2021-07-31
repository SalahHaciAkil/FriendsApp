import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/interfaces/Member';
import { Pagination } from 'src/app/interfaces/models/Paginations';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>
  predicate: string = "like"
  pageNumber = 1;
  pageSize = 5;
  totalPages: Array<any> = [];
  pagination: Pagination;
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.loadLikes("like", this.pageNumber, this.pageSize);
  }

  loadLikes(predicate: string, pageNumber: number, pageSize: number) {
    debugger;
    if (pageNumber < 1) return;
    this.pageNumber = pageNumber;
    this.memberService.getUserLikes(predicate, pageNumber, pageSize).subscribe((response) => {
      this.members = response.result;
      this.pagination = response.pagination;
      this.predicate = predicate

      this.totalPages = new Array(this.pagination.totalPages);


    })
  }

}
