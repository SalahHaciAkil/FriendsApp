import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinner: NgxSpinnerService) {

  }

  play() {
    this.busyRequestCount++;
    this.spinner.show(undefined, {
      type: "ball-running-dots",
      bdColor: "rgba(255,255,255,0)",
      color: "#d122e3"
    });
  }


  idle() {

    if (--this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide();
    }

  }
}
