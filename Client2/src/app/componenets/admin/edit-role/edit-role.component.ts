import { Component, Input, OnInit, Self } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  @Input() updateSelectedRoles = new EventEmitter();
  user: User;
  roles;
  class: string;



  // title: string;
  // closeBtnName: string;
  // // list: any[] = [];
  // user;
  // binding: string;
  // adminRoles = [
  //   { roleName: "Admin", roleValue: "Admin", checked: false },
  //   { roleName: "Moderator", roleValue: "Moderator", checked: false },
  //   { roleName: "Member", roleValue: "Member", checked: false }
  // ]
  constructor(public bsModalRef: BsModalRef) {

  }

  updateRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide()
  }
  ngOnInit(): void {
  }

  // onSubmitForm() {

  //   let userRoles = this.getRoles();
  //   this.adminService.changeUserRoles(this.user.userName, userRoles).subscribe((user: Partial<User>) => {
  //     this.toast.success("role updated for" + user.userName)
  //     this.user = user
  //     this.resetForm(user);
  //   })

  // }
  // resetForm(user: Partial<User>) {
  //   this.adminRoles.forEach(ele => {
  //     ele.checked = false;
  //   })
  //   let userRoles = user.roles;
  //   userRoles.forEach(element => {
  //     this.adminRoles.find(x => x.roleName == element).checked = true;
  //   });
  // }
  // getRoles() {
  //   let params: string[] = [];
  //   for (let index = 0; index < this.adminRoles.length; index++) {
  //     const element = this.adminRoles[index];

  //     if (element.checked) {
  //       params.push(element.roleValue);
  //     }
  //   }

  //   return params.toString();
  // }
  // checkRoleExisit(userRoles: string[], role: string) {
  //   let isItExisit = userRoles.includes(role);
  //   if (isItExisit) {
  //     let adminRole = this.adminRoles.find(x => x.roleName == role);
  //     adminRole.checked = true
  //   }
  //   return isItExisit;

  // }
}
