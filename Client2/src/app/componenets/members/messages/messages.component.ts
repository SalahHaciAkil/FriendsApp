import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Message } from 'src/app/interfaces/Message';
import { Pagination } from 'src/app/interfaces/models/Paginations';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  container = "Outbox";
  pageNumber = 1;
  pageSize = 5;
  tt: string;

  constructor(private messageService: MessageService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.loadMessages(this.pageNumber, this.pageSize, this.container);
  }

  loadMessages(pageNumber: number, pageSize: number, container: string) {
    this.messageService.getMessages(pageNumber, pageSize, container).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.container = container;

      this.pageNumber = pageNumber; this.pageSize = pageSize; this.container = container;
    })
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {

      this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
    })
    console.log(12);
    debugger;
  }




}
