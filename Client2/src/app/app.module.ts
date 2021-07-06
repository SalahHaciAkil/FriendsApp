import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './componenets/nav/nav.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './componenets/home/home.component';
import { RegisterFormComponent } from './componenets/register-form/register-form.component';
import { MemberListComponent } from './componenets/members/member-list/member-list.component';
import { MemberDetailsComponent } from './componenets/members/member-details/member-details.component';
import { ListsComponent } from './componenets/members/lists/lists.component';
import { MessagesComponent } from './componenets/members/messages/messages.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared.module';
import { TestErrorComponent } from './componenets/test-error/test-error.component';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { NotFoundComponent } from './componenets/not-found/not-found.component';
import { ServerErrorComponent } from './componenets/server-error/server-error.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterFormComponent,
    MemberListComponent,
    MemberDetailsComponent,
    ListsComponent,
    MessagesComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule


  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
