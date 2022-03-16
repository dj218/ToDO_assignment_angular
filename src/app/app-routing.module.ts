import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { LoginComponent } from '../modules/login/login.component';
import { ProfileComponent } from '../modules/profile/profile.component';
import { RegisterComponent } from '../modules/register/register.component';
import { TodolistCreateComponent } from './todolist/todolist-create/todolist-create.component';
import { TodolistEditComponent } from './todolist/todolist-edit/todolist-edit.component';
import { TodolistComponent } from './todolist/todolist.component';

const routes: Routes = [
  { path: '', component: RegisterComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent , canActivate:[AuthGuard]},
  { path: 'todolist', component: TodolistComponent , canActivate:[AuthGuard]},
  { path: 'todolist/create', component: TodolistCreateComponent,canActivate:[AuthGuard]},
  { path: 'todolist/edit', component: TodolistEditComponent,canActivate:[AuthGuard]},
  // children:[
  //   { path: 'create', component: TodolistCreateComponent},
  //   { path: 'edit', component: TodolistEditComponent}]
  // }, 
  { path: '**' , component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }