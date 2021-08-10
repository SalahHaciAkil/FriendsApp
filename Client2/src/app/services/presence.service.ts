import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { userInfo } from 'os';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();


  constructor(private toaster: ToastrService, private router: Router) { }


  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "precence", {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();


    this.hubConnection
      .start()
      .catch(error => console.log(error));


    this.hubConnection.on("UserIsOnline", username => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames, username]);
      })

    });

    this.hubConnection.on("UserIsOffline", username => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames.filter(usrnme => usrnme !== username)]);
      })
    });


    this.hubConnection.on("GetOnlineUsers", (usernames: string[]) => {
      this.onlineUsersSource.next(usernames);
    })

    this.hubConnection.on("NewMessageReceived", ({ userName, knowAs }) => {
      this.toaster.info(`${userName} send to you a messages`)
        .onTap
        .pipe(take(1))
        .subscribe(() => this.router.navigateByUrl(`/members/${userName}?activeTab=4`));
    })



  }

  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
  }

}
