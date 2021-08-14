import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {

  baseUrl: string = environment.apiUrl;
  model: any;
  errors: Array<string> = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get500Error() {
    this.http.get(this.baseUrl + "buggy/server-error").subscribe(data => {

    }, error => {
      console.log(error);

    })

  }

  get401AuthError() {
    this.http.get(this.baseUrl + "buggy/auth").subscribe(data => {

    }, error => {
      console.log(error);

    })

  }

  get404NotFoundError() {
    this.http.get(this.baseUrl + "buggy/not-found").subscribe(data => {

    }, error => {
      console.log(error);

    })

  }

  get400Error() {
    this.http.get(this.baseUrl + "buggy/bad-request").subscribe(data => {

    }, error => {
      console.log(error);

    })

  }

  get401ValidationError() {
    this.http.post(this.baseUrl + "account/register", {}).subscribe(data => {

    }, error => {
      this.errors = error

    })

  }

}
