import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isPassHidden: boolean = true;
  isRPassHidden: boolean = true;
  password: string;
  passRepeat: string;
  username: string;
  userType: string = "client";
  phoneNum: string;
  mail: string;

  agencyName?: string;
  agencyAddr?: string;
  agencyIdNum?: string;
  agencyDesc?: string;

  clientFirstname?: string;
  clientLastname?: string;

// error variables
  passwordErr: boolean = false;
  passRepeatErr: boolean = false;
  usernameErr: boolean = false;
  phoneNumErr: boolean = false;
  mailErr: boolean = false;

  agencyNameErr?: boolean = false;
  agencyAddrErr?: boolean = false;
  agencyIdNumErr?: boolean = false;
  agencyDescErr?: boolean = false;

  clientFirstnameErr?: boolean = false;
  clientLastnameErr?: boolean = false;

  errMessages: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  tooglePassVisibility(): void {
    this.isPassHidden = !this.isPassHidden;
  }

  toogleRPassVisibility(): void {
    this.isRPassHidden = !this.isRPassHidden;
  }

  usernameInputClicked(): void {
    this.usernameErr = false;
  }

  passwordInputClicked(): void {
    this.passwordErr = false;
  }

  passRepeatInputClicked(): void {
    this.passRepeatErr = false;
  }

  phoneNumInputClicked(): void {
    this.phoneNumErr = false;
  }

  mailInputClicked(): void {
    this.mailErr = false;
  }

  agencyNameInputClicked(): void {
    this.agencyNameErr = false;
  }

  agencyAddrInputClicked(): void {
    this.agencyAddrErr = false;
  }

  agencyIdNumInputClicked(): void {
    this.agencyIdNumErr = false;
  }

  agencyDescInputClicked(): void {
    this.agencyDescErr = false;
  }

  clientFirstnameInputClicked(): void {
    this.clientFirstnameErr = false;
  }

  clientLastnameInputClicked(): void {
    this.clientLastnameErr = false;
  }

  

}
