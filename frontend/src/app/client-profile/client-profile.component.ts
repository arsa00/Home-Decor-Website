import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { UserService } from '../services/user.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {

  loggedUser: User;
  editMode: boolean = false

  profileImg: any;
  chosenImgFile: File = null;

  imageSrc: string = "assets/user-default.png";

  imgErr: boolean = false;
  mailErr: boolean = false;
  phoneErr: boolean = false;
  errMessages: string[] = [];
  imgErrMessages: string[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));
    if(this.loggedUser?.imageType) {
      this.imageSrc = `${GlobalConstants.URI}/images/${this.loggedUser.username}/profileImg${this.loggedUser.imageType}`;
    }

    this.profileImg = document.getElementById("profileImg");
  }

  phoneNumInputClicked(): void {
    this.phoneErr = false;
  }

  mailInputClicked(): void {
    this.mailErr = false;
  }

  startEdit(): void {
    this.editMode = true;

    setTimeout(() => {
       this.profileImg = document.getElementById("profileImg");
       document.getElementById("imgPicker")?.addEventListener("change", this.fileChooseImg); 
      }, 250);
  }

  saveChagnes(): void {
    this.errMessages = [];
    const mailRegEx = new RegExp(GlobalConstants.REGEX_MAIL);
    const phoneRegEx = new RegExp(GlobalConstants.REGEX_PHONE);

    let isErrCatched: boolean = false;

    if(!this.loggedUser.mail || !mailRegEx.test(this.loggedUser.mail)) {
      this.mailErr = true;
      this.errMessages.push("Unesite ispravnu mejl adresu");
      isErrCatched = true
    }

    if(!this.loggedUser.phone || !phoneRegEx.test(this.loggedUser.phone)) {
      this.phoneErr = true;
      this.errMessages.push("Unesite ispravan broj telefona");
      isErrCatched = true
    }

    if(isErrCatched) return;

    this.editMode = false;

    this.userService
        .updateUserData(this.loggedUser.username, this.loggedUser.jwt, this.loggedUser.phone, this.loggedUser.mail, this.loggedUser.firstname, this.loggedUser.lastname)
        .subscribe({
          next: (newUser: User) => {
            newUser.jwt = this.loggedUser.jwt;
            this.loggedUser = newUser;
            localStorage.setItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER, JSON.stringify(newUser));
          },

          error: () => {
            // activate toast msg
            new bootstrap.Toast(document.getElementById("updateErr")).show();
            this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));
          }
    });

    if(this.chosenImgFile) {
      this.userService.uploadProfileImage(this.loggedUser.username, this.chosenImgFile).subscribe({
        next: (newUser: User) => {
          console.log("Image successfully uploaded");
          this.loggedUser.imageType = newUser.imageType;
          localStorage.setItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER, JSON.stringify(this.loggedUser));
          location.reload();
        },

        error: () => {
          console.log("Image upload failed");
        }
      });
    }
    
  }

  discardChagnes(): void {
    this.editMode = false;
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));
    this.errMessages = [];
    this.imgErrMessages = [];
    this.phoneErr = false;
    this.mailErr = false
    this.imgErr = false;
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
        this.profileImg.src = image.src;
      }
      
    });
  }

  setProfileImg(): void {
    if(this.loggedUser?.imageType) {
      this.profileImg.src = `${GlobalConstants.URI}/images/${this.loggedUser.username}/profileImg${this.loggedUser.imageType}`;
    } else {
      this.profileImg.src = "assets/user-default.png";
    }
  }

}
