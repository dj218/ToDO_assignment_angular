import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated: boolean = false;
  userEmail: string = '';
  constructor(private router: Router, private userservice: UserService) { }

  ngOnInit(): void {
    this.userservice.AuthenticationStatusChanged.subscribe((isAuthenticated) => {
      this.isAuthenticated = (this.userservice.activteUserEmail == '') ? false : true;
      this.userEmail = this.userservice.activteUserEmail;
    })
  }

  logout() {
    this.userservice.userlogout();
    this.router.navigate(['']);
  }
}
