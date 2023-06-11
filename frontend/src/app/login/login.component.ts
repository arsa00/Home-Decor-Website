import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { Router } from '@angular/router';

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
        // TODO: check for error; If succeded add JWT to localStorage;

        if(userDB) {
          // let jwt = res[]
          localStorage.setItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER, JSON.stringify(userDB));

          if(userDB.type === GlobalConstants.CLIENT_TYPE) {
            
          }

          switch(userDB.type) {
            case GlobalConstants.CLIENT_TYPE: this.router.navigate(["clientProfile"]); break;
            case GlobalConstants.AGENCY_TYPE: this.router.navigate(["agencyProfile"]); break;
            case GlobalConstants.ADMIN_TYPE: this.router.navigate(["adminDashboard"]); break;
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
