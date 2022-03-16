import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mustMatch } from '../../app/helpers/CustomValidators';
import { User } from '../../app/models/user.model';
import { UserService } from '../../app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12),mustMatch]],
      profileImageSrc : ['',[]]
    },
    {
       validator: mustMatch('password', 'confirmPassword')
    })
  }

  ngOnInit(): void {
  }

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
    if (this.RegisterForm.invalid) {
      return;
    }

    if(this.userservice.EmailIsUnique(this.RegisterForm.value['email'])){
      this.emailAlredyExist="Email Already Exist";
    }
    else{
      let user=this.RegisterForm.value;
      delete user.confirmPassword;
      this.userservice.AddUser(user);
      this.router.navigate(['/login']);
    }
  }
}