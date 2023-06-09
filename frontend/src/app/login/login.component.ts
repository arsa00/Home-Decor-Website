import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  isPassHidder: boolean = true;
  password: string;
  username: string;

  constructor() { }

  ngOnInit(): void {
  }

  tooglePassVisibility(): void {
    this.isPassHidder = !this.isPassHidder;
  }

}
