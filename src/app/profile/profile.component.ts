import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mustMatch } from '../helpers/CustomValidators';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileform: FormGroup;
  profileImageSrc: string = '';

  constructor(private userservice: UserService,private formbuilder:FormBuilder) {
    let user: User = userservice.getuser(userservice.activteUserEmail);

    this.profileform = this.formbuilder.group({
      email: [user.email,[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),Validators.email]],
      firstName: [user.firstName,[Validators.required]],
      lastName: [user.lastName,[Validators.required]],
      gender :[user.gender,[Validators.required]],
      address : [user.address,[Validators.required]],
      profileImage : ['',[]],
      profileImageSrc : [user.profileImageSrc,[]],
      password: [user.password,[Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      confirmPassword: [user.password,[Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
    },
    {
      validator: mustMatch('password', 'confirmPassword')
   })

    this.profileImageSrc=this.profileform.get('profileImageSrc')?.value as string;
   }

  ngOnInit(): void {
  }

  onImageChange(e:any) {
        const reader = new FileReader();
    
        if(e.target.files && e.target.files.length) {
          const [file] = e.target.files;
          reader.readAsDataURL(file);
    
          reader.onload = () => {
            this.profileImageSrc = reader.result as string;
            this.profileform.patchValue({
              profileImageSrc: reader.result
            });
          };
        }
      }

  onSubmit(){
      let profileData=this.profileform.value;
      console.log(profileData);
      this.userservice.edituser(this.userservice.activteUserEmail,profileData);  
      let user: User = this.userservice.getuser(this.userservice.activteUserEmail);
      console.log(user);
      }

}
