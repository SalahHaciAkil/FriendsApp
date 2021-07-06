import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {

  baseUrl: string = "https://localhost:5001/api/buggy";
  baseUrl2: string = "https://localhost:5001/api/account/register";
  model: any;
  errors: Array<string> = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get500Error() {
    this.http.get(this.baseUrl + "/server-error").subscribe(data => {

    }, error => {
      console.log(error);

    })

  }

  get401AuthError() {
    this.http.get(this.baseUrl + "/auth").subscribe(data => {

    }, error => {
      console.log(error);

    })

  }

  get404NotFoundError() {
    this.http.get(this.baseUrl + "/not-found").subscribe(data => {

    }, error => {
      console.log(error);

    })

  }

  get400Error() {
    this.http.get(this.baseUrl + "/bad-request").subscribe(data => {

    }, error => {
      console.log(error);

    })

  }

  get401ValidationError() {
    this.http.post(this.baseUrl2, {}).subscribe(data => {

    }, error => {
      this.errors = error

    })

  }

}
