import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  isPassHidden: boolean = true;
  isRPassHidden: boolean = true;
  password: string;
  passRepeat: string;
  recoveryLink: string;

  passwordErr: boolean = false;
  recoveryLinkErr: boolean = null;
  isRecoveryLinkChecked: boolean = false;
  errMessages: string[] = [];

  constructor(private userService: UserService, 
              private router: Router, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.recoveryLink = this.route.snapshot.paramMap.get("recoveryLink");

    // check if recovery link is good 
    this.userService.resetPassword(this.recoveryLink).subscribe({
      next: () => {
        this.recoveryLinkErr = false;
        this.isRecoveryLinkChecked = true;
      },

      error: () => {
        this.recoveryLinkErr = true;
        this.isRecoveryLinkChecked = true;
      }
    });
  }

  tooglePassVisibility(): void {
    this.isPassHidden = !this.isPassHidden;
  }

  toogleRPassVisibility(): void {
    this.isRPassHidden = !this.isRPassHidden;
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
    this.userService.resetPassword(this.recoveryLink, this.password).subscribe({
      next: () => {
        sessionStorage.setItem(GlobalConstants.SESSION_STORAGE_PASS_RESET, "true");
        this.router.navigate([GlobalConstants.ROUTE_LOGIN]);
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
