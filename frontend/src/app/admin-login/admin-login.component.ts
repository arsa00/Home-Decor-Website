import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

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
