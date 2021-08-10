import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "DatingApp";
  constructor(public accountService: AccountService, private presence:PresenceService) {

  }
  ngOnInit(): void {


    this.setCurrentUser();
  }

  setCurrentUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){

      this.accountService.setCurrentUserSource(user);
      this.presence.createHubConnection(user);
    }

  }

}