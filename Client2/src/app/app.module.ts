import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './componenets/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MemberCardComponent } from './componenets/members/member-card/member-card.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { EditUserComponent } from './componenets/members/edit-user/edit-user.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BusyInterceptor } from './interceptors/busy.interceptor';
import { EditPhotoComponent } from './componenets/members/edit-photo/edit-photo.component';
import { TextInputComponent } from './form/text-input/text-input.component';
import { MemberMessageComponent } from './componenets/members/member-message/member-message.component';



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
    MemberCardComponent,
    EditUserComponent,
    EditPhotoComponent,
    TextInputComponent,
    MemberMessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxGalleryModule,
    SharedModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BusyInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }