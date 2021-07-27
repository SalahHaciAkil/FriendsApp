import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../interfaces/Member';
import { PaginatedResult } from '../interfaces/models/Paginations';
import { User } from '../interfaces/User';
import { UserParams } from '../interfaces/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  members: Member[] = [];
  user:User;
  userParams:UserParams;

  constructor(private http: HttpClient, private accountService:AccountService) {
    const user = this.accountService.currentUser$.pipe(take(1)).subscribe(user=>{
      this.user = user;
      this.userParams = new UserParams(this.user);
    })
  }
  memberCache = new Map();


  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    console.log(Object.values(userParams));
    console.log(Object.values(userParams).join("-"));
    var userFilterResult = this.memberCache.get(Object.values(userParams).join("-"));
    if (userFilterResult) {
      return of(userFilterResult);
    }
    let paramss = this.getPaginationHeaders(userParams);
    return this.getPaginationResult<Member[]>(environment.apiUrl + '/users', paramss)
      .pipe(map((response) => {
        this.memberCache.set(Object.values(userParams).join("-"), response);
        return response;
      }))
  };

  getMember(username: string): Observable<Member> {

      const members = [...this.memberCache.values()].reduce((result, element)=>{
        return result.concat(element.result)
      },[]);
      const member = members.find((member:Member)=> member.userName == username);
      if(member)return of(member);
      
    

    return this.http.get<Member>(environment.apiUrl + "users/" + username);
  }

  updateMember(member: Member) {
    return this.http.put(environment.apiUrl + "users", member).pipe(
      map(() => {
        let index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(id: number) {
    return this.http.put(environment.apiUrl + `users/set-main-photo/${id}`, {});
  }

  deletePhoto(id: number) {
    return this.http.delete(environment.apiUrl + `users/delete-photo/${id}`);
  }


  private getPaginationHeaders(userParams: UserParams) {
    let paramss = new HttpParams();
    paramss = paramss.append("pageNumber", userParams.pageNumber.toString());
    paramss = paramss.append("pageSize", userParams.pageSize.toString());
    paramss = paramss.append("gender", userParams.gender);
    paramss = paramss.append("orderedBy", userParams.orderedBy);
    paramss = paramss.append("minAge", userParams.minAge.toString());
    paramss = paramss.append("maxAge", userParams.maxAge.toString());
    return paramss;

  }

  getPaginationResult<T>(url: string, paramss: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(environment.apiUrl + "users", { observe: 'response', params: paramss })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get("Pagination") !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
          }
          return paginatedResult;
        })
      );
  }
}


