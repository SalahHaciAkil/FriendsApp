import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../interfaces/models/Paginations";

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    let paramss = new HttpParams();
    paramss = paramss.append("pageNumber", pageNumber.toString());
    paramss = paramss.append("pageSize", pageSize.toString());
    return paramss;

}

export function getPaginationResult<T>(url: string, paramss: HttpParams, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return http.get<T>(url, { observe: 'response', params: paramss })
        .pipe(
            map(response => {
                paginatedResult.result = response.body;
                if (response.headers.get("Pagination") !== null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
                }
                debugger;
                return paginatedResult;
            })
        );

}