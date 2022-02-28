import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{

  constructor() {
      this.getdatafromlocalstorage()
   }
  ngOnInit(): void {  
  }

  
  private userarray: User[] = [];
  public activteUserEmail: string = '';
  public AuthenticationStatusChanged = new EventEmitter<string> ();
  
  getdatafromlocalstorage()
  {
    this.userarray = JSON.parse(localStorage.getItem('usersarray'));
  }

  userlogout() {
    this.activteUserEmail = '';
    this.AuthenticationStatusChanged.emit(this.activteUserEmail);
  }


  adduser(user: User) {
    this.userarray.push(user);
    console.log(user);
    localStorage.setItem('usersarray', JSON.stringify(this.userarray));
    this.activteUserEmail = user.email;
    this.AuthenticationStatusChanged.emit(user.email);
  }

  getuser(email:string):User
  {
    let i=0;
    for(let user of this.userarray)
    {
      if(user.email==email)
        break;
      i++;
    }
    return this.userarray[i];
  }
  
  edituser(userEmail: string,user: any) {
    let i = 0;
    for (let user of this.userarray) {
      if (user.email == userEmail)
        break;
      i++;
    }
    this.userarray[i].firstName = user.firstName;
    this.userarray[i].lastName = user.lastName;
    this.userarray[i].gender = user.gender;
    this.userarray[i].address = user.address;
    this.userarray[i].profileImage = user.profileImage;
    this.userarray[i].profileImageSrc = user.profileImageSrc;
    localStorage.setItem('usersarray', JSON.stringify(this.userarray));
  }

  UniqueEmail(email: string) 
  {
    for (let user of this.userarray) 
    {
      if (email == user.email) 
      {
        return false;
      }
    }
    return true;
  }

  uservalidation(email: string, password: string)
  {
    for (let user of this.userarray)
    {
      if (user.email == email && user.password == password) 
      {
        this.activteUserEmail = email;
        this.AuthenticationStatusChanged.emit(user.email);
        return true;
      }
    }
    return false;
  }
}
