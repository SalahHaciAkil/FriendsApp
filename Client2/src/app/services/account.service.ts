import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) { }
  baseUrl: string = environment.apiUrl;

  login(model: any) {
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(

      map((respone: User) => {
        const user = respone;
        if (user) {
          this.setCurrentUserSource(user);
          this.presence.createHubConnection(user);
        }

      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + "account/register", model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUserSource(user);
          this.presence.createHubConnection(user);

        }
      })
    );
  }

  setCurrentUserSource(user: User) {
  
    user.roles = [];
    const roles = this.getDecodeToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logOut() {
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }


  getDecodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
