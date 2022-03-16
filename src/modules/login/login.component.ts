import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../app/services/user.service';
import { User } from '../../app/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  Email:string;
  Password:string;
  wrongInput = false;

  constructor(private router: Router, private formbuilder: FormBuilder, private userservice: UserService) {
  }


  ngOnInit(): void {
  }

  gotoRegisterForm()
  {
    this.router.navigate(['']);
  }

  onSubmit() {
    if (this.userservice.UserExists(this.Email, this.Password)) {
      this.wrongInput = false;
      this.router.navigate(['/profile'],{queryParams:{'userEmail':this.userservice.activteUserEmail}});
    }
    else {
      this.wrongInput = true;
    }
  }
}