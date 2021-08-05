import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { AdminService } from 'src/app/services/admin.service';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-mangment',
  templateUrl: './user-mangment.component.html',
  styleUrls: ['./user-mangment.component.scss']
})
export class UserMangmentComponent implements OnInit {
  users: Partial<User[]>;
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService,
    private toast: ToastrService) { }
  ngOnInit(): void {

    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersRoles().subscribe(users => {
      this.users = users;
    })

  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        user,
        roles: this.getRolesArray(user)
      }
    }
    this.bsModalRef = this.modalService.show(EditRoleComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
      const rolesToUpdate = {
        roles: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      if (rolesToUpdate.roles?.toString().length > 0) {
        debugger;
        this.adminService.changeUserRoles(user.userName, rolesToUpdate.roles.toString()).subscribe(() => {
          user.roles = [...rolesToUpdate.roles]
          this.toast.success(`${user.userName} is ${rolesToUpdate.roles.toString()}`)
        })
      } else {
        this.toast.error("Every user must have at lease one role");
      }
    })
  }

  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' }
    ];

    availableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of userRoles) {
        if (role.name === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    })
    return roles;
  }

}
