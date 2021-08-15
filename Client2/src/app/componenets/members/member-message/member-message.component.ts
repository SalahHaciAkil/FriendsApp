import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Message } from 'src/app/interfaces/Message';
import { User } from 'src/app/interfaces/User';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.scss']
})
export class MemberMessageComponent implements OnInit, AfterViewChecked {
  messages: Message[]

  @ViewChild("messageForm") messageForm: NgForm;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChildren('messages') message: QueryList<any>;


  @Input() username: string;
  user: User;
  messageContent: string;

  constructor(private http: HttpClient, public messageService: MessageService,
    private accountService: AccountService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit(): void {
    this.getMessagesThread();

  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
    this.message.changes.subscribe(this.scrollToBottom);
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }

  }




  getMessagesThread() {
    // this.messageService.getMessageThread(this.username).subscribe(messages => {
    //   this.messages = messages;
    // })
    debugger;
    if (!this.messageService.isThereHubConnection()) {
      debugger;
      this.messageService.createHubConnetion(this.user, this.username);

    }

  }

  sendMessage() {
    debugger;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm.reset("messageContent");
      // this.messageForm.reset() in this case we reset everything in the form;
    })

  }
}
