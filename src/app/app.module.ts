import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { TodolistComponent } from './todolist/todolist.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TodolistEditComponent } from './todolist/todolist-edit/todolist-edit.component';
import { TodolistItemComponent } from './todolist/todolist-item/todolist-item.component';
import { TodolistHeaderComponent } from './todolist/todolist-header/todolist-header.component';
import { TodolistCreateComponent } from './todolist/todolist-create/todolist-create.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HeaderComponent,
    TodolistComponent,
    RegisterComponent,
    LoginComponent,
    TodolistEditComponent,
    TodolistItemComponent,
    TodolistHeaderComponent,
    TodolistCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
