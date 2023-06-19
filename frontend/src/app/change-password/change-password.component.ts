import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/User';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @Input() user: User;
  @Input() closeDialogFunc: () => void;
  @Input() changeSuccessful: () => void;

  isPassOldHidden: boolean = true; // Old
  isPassHidden: boolean = true;
  isRPassHidden: boolean = true;
  
  passwordOld: string;
  password: string;
  passRepeat: string;

  passwordOldErr: boolean = false;
  passwordErr: boolean = false;
  errMessages: string[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  tooglePassOldVisibility(): void {
    this.isPassOldHidden = !this.isPassOldHidden;
  }

  tooglePassVisibility(): void {
    this.isPassHidden = !this.isPassHidden;
  }

  toogleRPassVisibility(): void {
    this.isRPassHidden = !this.isRPassHidden;
  }

  passwordOldInputClicked(): void {
    this.passwordOldErr = false;
  }

  passwordInputClicked(): void {
    this.passwordErr = false;
  }

  changePass(): void {
    this.errMessages = [];

    const passwordRegEx = new RegExp(GlobalConstants.REGEX_PASSWORD);
    let isErrCatched: boolean = false;

    if(!this.password || !passwordRegEx.test(this.password) || this.password.length < 7 || this.password.length > 12) {
      this.passwordErr = true;
      isErrCatched = true
    }
    
    if(!this.passRepeat) {
      this.passwordErr = true;
      isErrCatched = true
    }

    if(this.passRepeat !== this.password) {
      this.errMessages.push("Lozinke se ne podudaraju.");
      this.passwordErr = true;
      isErrCatched = true;
    }

    if(isErrCatched) return;

    // send request for changing user's password
    this.userService.changePassword(this.user.username, this.user.jwt, this.passwordOld, this.password).subscribe({
      next: () => {
        this.changeSuccessful();
        this.closeDialogFunc();
      },

      error: (res) => {
        if(res.error.errMsg) {
          this.errMessages.push(res.error.errMsg);
        } else {
          console.log(res);
          this.errMessages.push("Došlo je do greške. Pokušajte ponovo.");
        }
      }
    });
  }

}
