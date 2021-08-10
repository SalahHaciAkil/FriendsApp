import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/interfaces/Member';
import { MemberService } from 'src/app/services/member.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;
  isItLiked: boolean = false;
  iconsList = ["fas fa-heart-broken", "far fa-heart"]
  iconClass = this.iconsList[0];
  constructor(private memberService: MemberService, private toaster: ToastrService,
    public presence: PresenceService) { }

  ngOnInit(): void {
  }


  addLike(member) {
    let i = this.presence.onlineUsers$.subscribe(userss => {
      console.log(userss);

    })

    this.memberService.AddLike(member.userName).subscribe(() => {
      this.toaster.success(`You liked ${member.userName}`)
    })

  }

}
