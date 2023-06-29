import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-password-recovery-request',
  templateUrl: './password-recovery-request.component.html',
  styleUrls: ['./password-recovery-request.component.css']
})
export class PasswordRecoveryRequestComponent implements OnInit {

  mail: string;

  mailErr: boolean = false;
  errMessages: string[] = [];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  mailInputClicked(): void {
    this.mailErr = false;
  }

  sendRequest(): void {
    this.errMessages = [];
    
    const mailRegEx = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    if(!this.mail || !mailRegEx.test(this.mail)) {
      this.mailErr = true;
      return;
    }

    this.userService.requestPasswordReset(this.mail).subscribe({
      next: () => {
        sessionStorage.setItem(GlobalConstants.SESSION_STORAGE_PASS_RESET_REQ, "true");
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
