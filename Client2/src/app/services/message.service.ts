import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { getPaginationHeaders, getPaginationResult } from '../helpers/paginationRequest';
import { Message } from '../interfaces/Message';
import { User } from '../interfaces/User';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient, private busyService: BusyService) { }


  createHubConnetion(user: User, otherUser: string) {
    this.busyService.play();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + `message?user=${otherUser}`, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();


    this.hubConnection.start().catch(error => console.log(error)).finally(() => {
      this.busyService.idle();
    });


    this.hubConnection.on("ReceiveMessageThread", messages => {
      this.messageThreadSource.next(messages)
    })

    this.hubConnection.on("NewMessage", message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        // messages.push(message);
        this.messageThreadSource.next([...messages, message])
        // this.messageThreadSource.next(messages);
      })
    })

  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop().catch(error => console.log(error));


    }

  }

  isThereHubConnection() {
    if (this.hubConnection) return true;
    return false;
  }
  getMessages(pageNumber: number, pageSize: number, container: string) {

    let paramss = getPaginationHeaders(pageNumber, pageSize);
    paramss = paramss.append("container", container);
    return getPaginationResult<Message[]>(this.baseUrl + "message", paramss, this.http);

  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + "message/thread/" + username);
  }

  async sendMessage(userName: string, content: string) { //we guratee we use here promise dut to async
    return this.hubConnection.invoke("SendMessage", { reciptientUserName: userName, content })
      .catch(error => console.log(error)
      );
  }

  deleteMessage(id: number) {
    debugger;
    return this.http.delete(this.baseUrl + "message/" + id);
  }
}
