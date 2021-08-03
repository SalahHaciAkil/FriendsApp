import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginationHeaders, getPaginationResult } from '../helpers/paginationRequest';
import { Message } from '../interfaces/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string) {

    let paramss = getPaginationHeaders(pageNumber, pageSize);
    paramss = paramss.append("container", container);
    return getPaginationResult<Message[]>(this.baseUrl + "message", paramss, this.http);

  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + "message/thread/" + username);
  }

  sendMessage(userName: string, content: string) {
    return this.http.post<Message>(this.baseUrl + "message", { reciptientUserName: userName, content });
  }

  deleteMessage(id: number) {
    debugger;
    return this.http.delete(this.baseUrl + "message/" + id);
  }


  // private getPaginationHeaders(pageNumber: number, pageSize: number) {
  //   let paramss = new HttpParams();
  //   paramss = paramss.append("pageNumber", pageNumber.toString());
  //   paramss = paramss.append("pageSize", pageSize.toString());
  //   return paramss;

  // }

  // getPaginationResult<T>(url: string, paramss: HttpParams) {
  //   const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  //   debugger;

  //   return this.http.get<T>(url, { observe: 'response', params: paramss })
  //     .pipe(
  //       map(response => {
  //         paginatedResult.result = response.body;
  //         if (response.headers.get("Pagination") !== null) {
  //           paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
  //         }
  //         debugger;
  //         return paginatedResult;
  //       })
  //     );

  // }

}
