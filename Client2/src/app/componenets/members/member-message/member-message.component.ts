import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/interfaces/Message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.scss']
})
export class MemberMessageComponent implements OnInit {
  messages: Message[]
  @ViewChild("messageForm") messageForm: NgForm;
  @Input() username: string;
  messageContent: string;
  constructor(private http: HttpClient, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getMessagesThread();
  }


  getMessagesThread() {
    this.messageService.getMessageThread(this.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(message => {
      this.messages.push(message);
      this.messageForm.reset("messageContent");
      // this.messageForm.reset() in this case we reset everything in the form;
    })

  }
}
