import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanaelComponent } from './componenets/admin/admin-panael/admin-panael.component';
import { HomeComponent } from './componenets/home/home.component';
import { EditUserComponent } from './componenets/members/edit-user/edit-user.component';
import { ListsComponent } from './componenets/members/lists/lists.component';
import { MemberDetailsComponent } from './componenets/members/member-details/member-details.component';
import { MemberListComponent } from './componenets/members/member-list/member-list.component';
import { MessagesComponent } from './componenets/members/messages/messages.component';
import { NotFoundComponent } from './componenets/not-found/not-found.component';
import { ServerErrorComponent } from './componenets/server-error/server-error.component';
import { TestErrorComponent } from './componenets/test-error/test-error.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MemberListComponent, canActivate: [AuthGuard] },
      { path: 'members/:username', component: MemberDetailsComponent },
      { path: 'member/edit', component: EditUserComponent, canDeactivate: [PreventUnsavedChangesGuard] },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'admin', component: AdminPanaelComponent, canActivate: [AdminGuard] },
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