import { Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Directive } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../interfaces/User';
import { AccountService } from '../services/account.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole:string[];
  user: User;
  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>,
    private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }


  ngOnInit(): void {
    debugger;
    // clear view if no roles
    if (!this.user?.roles || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }

    for (let index = 0; index < this.user.roles.length; index++) {
      debugger;
      const element = this.user.roles[index];
      if (this.appHasRole.includes(element, 0)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
        return;
      }

    }
    this.viewContainerRef.clear();


    // if (this.user?.roles.some(r => this.appHasRoles.includes(r))) {
    // } else {
    // }
  }
}
