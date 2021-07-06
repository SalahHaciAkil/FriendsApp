import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../interfaces/User';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private toast: ToastrService) {

  }


  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user: User) => {
        if (user) return true;
        this.toast.error("You are not logged in, please log in and try");
        return false;
      })
    )
  }

}
