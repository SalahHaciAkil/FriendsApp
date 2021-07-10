import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../interfaces/Member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  members:Member[] =[];
  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]> {
    if(this.members.length > 0)return of(this.members)
    return this.http.get<Member[]>(environment.apiUrl + "users").pipe(
      map(members=>{
        this.members=members;
        return members;
      })
    );
  }

  getMember(username: string): Observable<Member> {
    const user = this.members.find(member =>{
      return member.userName === username;
    })
    if(user !== undefined)return of(user);
    return this.http.get<Member>(environment.apiUrl + "users/" + username);
  }

  updateMember(member:Member){
    return this.http.put(environment.apiUrl + "users", member).pipe(
      map(()=>{
        let index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
