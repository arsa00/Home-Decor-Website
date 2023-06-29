import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { User } from '../models/User';

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


  profileImg: any;
  chosenImgFile: File = null;
  imgErr: boolean = false;
  imgErrMessages: string[] = [];


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.profileImg = document.getElementById("profileImg");
    this.setProfileImg();
    document.getElementById("rbClient").addEventListener("change", this.setProfileImg);
    document.getElementById("rbAgency").addEventListener("change", this.setProfileImg);
    document.getElementById("imgPicker").addEventListener("change", this.fileChooseImg);
  }

  fileChooseImg = (e): void => {
    this.imgErrMessages = [];
    this.imgErr = false;

    const selectedImg: File = e.target.files[0];
    // console.log(selectedImg);
    
    if(selectedImg.type != "image/png" && selectedImg.type != "image/jpeg") {
      this.chosenImgFile = null;
      this.setProfileImg();
      this.imgErr = true;
      this.imgErrMessages.push("Podržani formati za sliku su PNG i JPG");
      return;
    }

    // set chosen image file to currently selected file
    this.chosenImgFile = selectedImg;

    // create image from selected file (to perform height & width checkup)
    const image = new Image();
    image.src = URL.createObjectURL(selectedImg); 

    image.addEventListener("load", () => {
      
      if(image.height < 100 || image.width < 100 || image.height > 300 || image.width > 300 /*|| image.width !== image.height*/) {
        this.chosenImgFile = null;
        this.setProfileImg();
        this.imgErr = true;
        this.imgErrMessages.push("Min. veličina slike je 100x100 piksela, dok je maks. veličina 300x300 piksela");
        return;
      } else {
        this.profileImg.style.backgroundImage = `url(${image.src})`;
      }
      
    });
  }

  setProfileImg = () => {
    if(this.chosenImgFile) return;

    if(this.userType === GlobalConstants.CLIENT_TYPE) {
      this.profileImg.style.backgroundImage = `url('assets/user-default.png')`;
    } else {
      this.profileImg.style.backgroundImage = `url('assets/agency-default.png')`;
    }
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

  register(): void {
    this.errMessages = [];

    let isErrCatched: boolean = false;
    const mailRegEx = new RegExp(GlobalConstants.REGEX_MAIL); // "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
    const phoneRegEx = new RegExp(GlobalConstants.REGEX_PHONE); // "^[0-9/\\-+ ]{5,25}$"
    // const lChar = "[a-z]";  // lowercase char
    // const uChar = "[A-Z]";  // uppercase char
    // const num = "[0-9]";
    // const spec = "[\\\\\\-*+.,&^%$#@!?~`/()_=[\\]{};:'\"><|]";
    const passwordRegEx = new RegExp(GlobalConstants.REGEX_PASSWORD); // `^(${lChar}.*(${uChar}.*${num}.*${spec}|${uChar}.*${spec}.*${num}|${spec}.*${uChar}.*${num}|${spec}.*${num}.*${uChar}|${num}.*${spec}.*${uChar}|${num}.*${uChar}.*${spec})|${uChar}.*(${num}.*${spec}|${spec}.*${num})).*$`

    // console.log(passwordRegEx.toString());

    // common fields checkup
    if(!this.username) {
      this.usernameErr = true;
      isErrCatched = true
    }

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

    if(!this.phoneNum || !phoneRegEx.test(this.phoneNum)) {
      this.phoneNumErr = true;
      isErrCatched = true
    }

    if(!this.mail || !mailRegEx.test(this.mail)) {
      this.mailErr = true;
      isErrCatched = true
    }
  
    // agency-only fields checkup
    if(this.userType === GlobalConstants.AGENCY_TYPE) {

      if(!this.agencyName) {
        this.agencyNameErr = true;
        isErrCatched = true
      }

      if(!this.agencyAddr) {
        this.agencyAddrErr = true;
        isErrCatched = true
      }

      if(!this.agencyDesc) {
        this.agencyDescErr = true;
        isErrCatched = true
      }

      if(!this.agencyIdNum) {
        this.agencyIdNumErr = true;
        isErrCatched = true
      }

    }

    // client-only fields checkup
    if(this.userType === GlobalConstants.CLIENT_TYPE) {

      if(!this.clientFirstname) {
        this.clientFirstnameErr = true;
        isErrCatched = true
      }

      if(!this.clientLastname) {
        this.clientLastnameErr = true;
        isErrCatched = true
      }

    }

    if(isErrCatched) return;

    // form data checkup succeeded, continue registration
    if(this.userType === GlobalConstants.CLIENT_TYPE) {
      this.userService
          .registerClient(this.username, this.password, this.phoneNum, this.mail, this.clientFirstname, this.clientLastname)
          .subscribe({

            next: () => {
              if(this.chosenImgFile) {
                this.userService.uploadProfileImage(this.username, this.chosenImgFile).subscribe({
                  next: (newUser: User) => {
                    console.log("Image successfully uploaded");
                  },

                  error: () => {
                    console.log("Image upload failed");
                  }
                });
              }

              sessionStorage.setItem(GlobalConstants.SESSION_STORAGE_REGISTRATION, "true");
              this.router.navigate([GlobalConstants.ROUTE_LOGIN]);
            },

            error: (res) => {
              if(res.error.errMsg) {
                this.errMessages.push(res.error.errMsg);
              } else {
                console.log(res);
                this.errMessages.push("Došlo je do greške. Pokušajte ponovo.");
              }

              new bootstrap.Toast(document.getElementById("regErr")).show();
            }

          });
    } 
    
    if(this.userType === GlobalConstants.AGENCY_TYPE) {
      this.userService
          .registerAgency(this.username, this.password, this.phoneNum, this.mail, this.agencyName, this.agencyAddr, this.agencyIdNum, this.agencyDesc)
          .subscribe({

            next: () => {
              if(this.chosenImgFile) {
                this.userService.uploadProfileImage(this.username, this.chosenImgFile).subscribe({
                  next: (newUser: User) => {
                    console.log("Image successfully uploaded");
                  },

                  error: () => {
                    console.log("Image upload failed");
                  }
                });
              }

              sessionStorage.setItem(GlobalConstants.SESSION_STORAGE_REGISTRATION, "true");
              this.router.navigate([GlobalConstants.ROUTE_LOGIN]);
            },

            error: (res) => {
              if(res.error.errMsg) {
                this.errMessages.push(res.error.errMsg);
              } else {
                console.log(res);
                this.errMessages.push("Došlo je do greške. Pokušajte ponovo.");
              }

              new bootstrap.Toast(document.getElementById("regErr")).show();
            }

          });
    }

  }

}
