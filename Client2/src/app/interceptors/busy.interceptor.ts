import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusyService } from '../services/busy.service';
import { delay, finalize } from 'rxjs/operators';

@Injectable()
export class BusyInterceptor implements HttpInterceptor {

  constructor(private busy: BusyService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.busy.play();
    return next.handle(request).pipe(
      delay(1000),
      finalize(() => {
        this.busy.idle();
      })
    );
  }
}
