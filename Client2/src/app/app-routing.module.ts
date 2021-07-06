import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenets/home/home.component';
import { ListsComponent } from './componenets/members/lists/lists.component';
import { MemberDetailsComponent } from './componenets/members/member-details/member-details.component';
import { MemberListComponent } from './componenets/members/member-list/member-list.component';
import { MessagesComponent } from './componenets/members/messages/messages.component';
import { NotFoundComponent } from './componenets/not-found/not-found.component';
import { ServerErrorComponent } from './componenets/server-error/server-error.component';
import { TestErrorComponent } from './componenets/test-error/test-error.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MemberListComponent, canActivate: [AuthGuard] },
      { path: 'members/:id', component: MemberDetailsComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ]
  }
  ,
  { path: 'test-error', component: TestErrorComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
