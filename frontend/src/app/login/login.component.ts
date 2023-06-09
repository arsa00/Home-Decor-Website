import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

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

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const isRegistrationSucc = sessionStorage.getItem(GlobalConstants.SESSION_STORAGE_REGISTRATION);

    if(isRegistrationSucc) {
      if(isRegistrationSucc === "true") {
        new bootstrap.Toast(document.getElementById("regSucc")).show();
      }

      sessionStorage.removeItem(GlobalConstants.SESSION_STORAGE_REGISTRATION);
    }


    const isPassReseted = sessionStorage.getItem(GlobalConstants.SESSION_STORAGE_PASS_RESET);

    if(isPassReseted) {
      if(isPassReseted === "true") {
        new bootstrap.Toast(document.getElementById("passResetSucc")).show();
      }

      sessionStorage.removeItem(GlobalConstants.SESSION_STORAGE_PASS_RESET);
    }


    const isPassResetRequested = sessionStorage.getItem(GlobalConstants.SESSION_STORAGE_PASS_RESET_REQ);

    if(isPassResetRequested) {
      if(isPassResetRequested === "true") {
        new bootstrap.Toast(document.getElementById("passResetReqSucc")).show();
      }

      sessionStorage.removeItem(GlobalConstants.SESSION_STORAGE_PASS_RESET_REQ);
    }

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
    this.errMessages = [];

    if(!this.password) {
      this.passwordErr = true;
    }

    if(!this.username) {
      this.usernameErr = true;
    }

    if(this.usernameErr || this.passwordErr) return;


    this.userService.login(this.username, this.password).subscribe({

      next: (userDB: User) => {

        if(userDB) {
          if(userDB.type == GlobalConstants.ADMIN_TYPE)
            localStorage.setItem(GlobalConstants.LOCAL_STORAGE_LOGGED_ADMIN, JSON.stringify(userDB));
          else
            localStorage.setItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER, JSON.stringify(userDB));

          switch(userDB.type) {
            case GlobalConstants.CLIENT_TYPE: this.router.navigate([GlobalConstants.ROUTE_CLIENT_PROFILE]); break;
            case GlobalConstants.AGENCY_TYPE: this.router.navigate([GlobalConstants.ROUTE_AGENCY_PROFILE]); break;
            case GlobalConstants.ADMIN_TYPE: this.router.navigate([GlobalConstants.ROUTE_ADMIN_DASHBOARD]); break;
          }
        } else {
          this.addErrMessages("Došlo je do greške. Pokušajte ponovo.");
        }

      },

      error: (res) => {

        if(res.error.errMsg) {
          this.addErrMessages(res.error.errMsg);
        } else {
          this.addErrMessages("Došlo je do greške. Pokušajte ponovo.");
        }
        
      }
    });
  }

  addErrMessages(...msgs: string[]) : void {
    this.errMessages.push(...msgs);
    this.password = "";
  }



}
