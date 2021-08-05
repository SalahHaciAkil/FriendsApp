import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }


  getUsersRoles() {
    return this.http.get<Partial<User[]>>(this.baseUrl + "admin/users-with-roles");
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }
  changeUserRoles(userName: string, roles: string) {
    debugger;
    return this.http.post<Partial<User>>(this.baseUrl + 'admin/edit-roles/' + userName + "?roles=" + roles, {})
  }
}
