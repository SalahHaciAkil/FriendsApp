import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeagoModule } from 'ngx-timeago';
// import { NbThemeModule } from '@nebular/theme';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    FileUploadModule,
    TimeagoModule.forRoot()
  ],
  exports: [
    ToastrModule,
    FileUploadModule,
    TimeagoModule
  ]
})
export class SharedModule { }