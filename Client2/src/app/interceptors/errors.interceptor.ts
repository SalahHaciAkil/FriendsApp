import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor(private route: Router, private toast: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                let allErrors: Array<any> = [];

                for (let err in error.error.errors) {
                  allErrors.push(error.error.errors[err]);
                }

                throw allErrors.flat();
              }
              else if (typeof (error.error) == "object") {
                const err = error.statusText == "OK" ? "Bad Request" : error.statusText;
                err == error.statusText ? this.toast.error(error.statusText) :
                  this.toast.error("Bad Request", error.status);

              }
              else {
                this.toast.error(error.error, error.status);
              }
              break;

            case 401:
              const err = error.statusText == "OK" ? "Unauthorized" : error.statusText;
              err == error.statusText ? this.toast.error(error.statusText) :
                this.toast.error("Unauthorized", error.status);

              break;

            case 404:
              this.route.navigateByUrl('/not-found')
              break;

            case 500:
              const navigationExtras: NavigationExtras = { state: { error: error.error } };
              this.route.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              this.toast.error("Unexpected Error")
              debugger;
              break;
          }
        }

        return throwError(error);
      })
    );
  }
}
