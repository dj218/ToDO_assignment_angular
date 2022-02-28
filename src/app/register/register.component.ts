import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mustMatch } from '../helpers/CustomValidators';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  submitted = false;
  emailAlredyExist ="";
  profileImage: string = '';
  RegisterForm: FormGroup;

  constructor(private router: Router, private formbuilder: FormBuilder,private userservice:UserService) {
    this.RegisterForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"), Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      profileImage : ['',[]],
      profileImageSrc : ['',[]]
    },
    {
       validator: mustMatch('password', 'confirmPassword')
    })
  }



  ngOnInit(): void {
  }

  // // convenience getter for easy access to form fields
  // get f() { return this.RegisterForm.controls; }

  gotoLoginForm() {
    this.router.navigate(['/login']);
  }

  onaddImage(e: any) {
    const reader = new FileReader();

    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.profileImage = reader.result as string;
        this.RegisterForm.patchValue({
          profileImageSrc: reader.result
        });

      };
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.RegisterForm.invalid) {
      return;
    }

    if(this.userservice.UniqueEmail(this.RegisterForm.value['email'])){
      let user=<User>this.RegisterForm.value;
      this.userservice.adduser(user);
      console.log(this.RegisterForm);
      this.router.navigate(['/profile']);
    }
    else{
      //Email already exists.
      this.emailAlredyExist="Email Already Exist";
    }
  }
}
