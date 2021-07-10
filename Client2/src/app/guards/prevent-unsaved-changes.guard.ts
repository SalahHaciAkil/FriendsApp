import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EditUserComponent } from '../componenets/members/edit-user/edit-user.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(component: EditUserComponent): boolean {
    if(component.form.dirty){
      return confirm("You will leave with out saving your changes, are you sure ?");
    }
    return true;
  }
  
}
