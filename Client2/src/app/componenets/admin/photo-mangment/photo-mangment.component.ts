import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-photo-mangment',
  templateUrl: './photo-mangment.component.html',
  styleUrls: ['./photo-mangment.component.scss']
})
export class PhotoMangmentComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }



  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
