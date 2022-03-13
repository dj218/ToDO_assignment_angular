import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  wrongInput = false;
  LoginForm: FormGroup;

  constructor(private router: Router, private formbuilder: FormBuilder, private userservice: UserService) {
    this.LoginForm = this.formbuilder.group({
      'email': ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"), Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(8)]]
    })
  }


  ngOnInit(): void {
  }

  gotoRegisterForm()
  {
    this.router.navigate(['']);
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.LoginForm.invalid)
      return;

    // from user service it will check if user exists in the local storage or not and will navigate to the login page 
    if (this.userservice.UserExists(this.LoginForm.value['email'], this.LoginForm.value['password'])) {
      this.wrongInput = false;
      this.router.navigate(['/profile'],{queryParams:{'userEmail':this.userservice.activteUserEmail}});
    }
    else {
      this.wrongInput = true;
    }
  }
}
