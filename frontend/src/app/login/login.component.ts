import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  isPassHidder: boolean = true;
  password: string;
  username: string;

  passwordErr: boolean = false;
  usernameErr: boolean = false;

  errMessages: string[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  tooglePassVisibility(): void {
    this.isPassHidder = !this.isPassHidder;
  }

  usernameInputClicked(): void {
    this.usernameErr = false;
  }

  passwordInputClicked(): void {
    this.passwordErr = false;
  }

  login(): void {
    if(!this.password) {
      this.passwordErr = true;
    }

    if(!this.username) {
      this.usernameErr = true;
    }

    if(this.usernameErr || this.passwordErr) return;

/*
    this.userService.login(this.username, this.password).subscribe(() => {
      // TODO: check for error; If succeded add JWT to localStorage;
    });
*/
  }

}
