import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{

  constructor() {
    this.GetDataFromLocalStorage() 
   }

  ngOnInit(): void { 
    
  }

  
  private userarray: User[] = [];
  public activteUserEmail: string = '';
  public AuthenticationStatusChanged = new EventEmitter<string> ();
  
  GetDataFromLocalStorage()
  {
    this.userarray = JSON.parse(localStorage.getItem('usersarray')) || [];
  }

  UserLogout() {
    this.activteUserEmail = '';
    this.AuthenticationStatusChanged.emit(this.activteUserEmail);
  }


  AddUser(user: User) {
    this.userarray.push(user);
    localStorage.setItem('usersarray', JSON.stringify(this.userarray));
    this.AuthenticationStatusChanged.emit(user.email);
  }

  getIndex(email:string)
  {
    let i=this.userarray.findIndex((user)=>user.email==email);
    return i;
  }
  
  GetUser(email:string):User
  {
    return this.userarray.find((user) => user.email == email);
  }
  
  EditUser(userEmail: string,user: any) {
    let i=this.getIndex(userEmail);
    this.userarray[i].firstName = user.firstName;
    this.userarray[i].lastName = user.lastName;
    this.userarray[i].gender = user.gender;
    this.userarray[i].address = user.address;
    this.userarray[i].profileImageSrc = user.profileImageSrc;
    localStorage.setItem('usersarray', JSON.stringify(this.userarray));
  }

  EmailIsUnique(email: string) 
  { 
    return this.userarray.some((user) => user.email == email);
  }

  UserExists(email: string, password: string)
  {
    let i=this.getIndex(email);
    if(this.userarray[i].email===email && this.userarray[i].password==password)
    {
      this.activteUserEmail = email;
      this.AuthenticationStatusChanged.emit(this.userarray[i].email);
      return true;
    }
    else return false;
  }
}