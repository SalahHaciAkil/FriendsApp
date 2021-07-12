import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }
  baseUrl: string = environment.apiUrl;

  login(model: any) {
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(

      map((respone: User) => {
        const user = respone;
        if (user) {
          this.setCurrentUserSource(user);
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

        }
      })
    );
  }

  setCurrentUserSource(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logOut() {
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
  }
}
