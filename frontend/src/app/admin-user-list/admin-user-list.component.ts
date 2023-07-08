import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import * as bootstrap from 'bootstrap';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.css']
})
export class AdminUserListComponent implements OnInit {

  static readonly NUM_OF_USERS_PER_PAGE: number = 9;

  loggedAdmin: User;

  activePage: number = 0;
  numOfPages: number = 0;
  showPage: number[] = [];

  allUsers: User[] = [];
  selectedIndex: number;
  selectedUser: User;

  editMode: boolean = false;
  deleteMode: boolean = false;

  isAddNewUserDialogActive: boolean = false;

  errToastMsg: string;
  succToastMsg: string;

  loadingDialogActive: boolean = false;
  loadingHeaderTxt: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loggedAdmin = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    this.userService.getNumberOfUsers(this.loggedAdmin.jwt).subscribe({
      next: (res) => { 
        if(res["numOfUsers"]) {
          const numOfUsers = res["numOfUsers"];

          this.numOfPages = Math.floor(numOfUsers / AdminUserListComponent.NUM_OF_USERS_PER_PAGE) 
                          + ((numOfUsers % AdminUserListComponent.NUM_OF_USERS_PER_PAGE) == 0 ? 0 : 1);

          console.log(this.numOfPages);

          if(!this.numOfPages) return;

          this.fetchUsers();
        }
      },
      error: () => { this.displayErrorToast("Došlo je do greške. Probajte da osvežite stranicu."); }
    });
  }

  displayErrorToast(msg: string) {
    this.errToastMsg = msg;
    new bootstrap.Toast(document.getElementById("err")).show(); 
  }

  displaySuccessfulToast(msg: string) {
    this.succToastMsg = msg;
    new bootstrap.Toast(document.getElementById("succ")).show(); 
  }

  hideLoadingDialog() {
    this.loadingDialogActive = false;
  }

  private showLoadingDialog(msg: string) {
    this.loadingHeaderTxt = msg;
    this.loadingDialogActive = true;
  }

  fetchUsers() {
    this.userService.getSliceOfUsers(this.loggedAdmin.jwt,
                                    this.activePage * AdminUserListComponent.NUM_OF_USERS_PER_PAGE, 
                                    AdminUserListComponent.NUM_OF_USERS_PER_PAGE)
    .subscribe({
      next: (users: User[]) => {
        this.allUsers = users;
        console.log(users);
      },
      error: () => { this.displayErrorToast("Došlo je do greške prilikom dohvatanja korisnika. Probajte da osvežite stranicu."); }
    });
  }

  isClient(type: string): boolean {
    return type == GlobalConstants.CLIENT_TYPE;
  }

  isAgency(type: string): boolean {
    return type == GlobalConstants.AGENCY_TYPE;
  }

  showPageNumbers() {
    return Array(this.numOfPages);
  }

  selectPage(page: number) {
    if(page < 0 || page >= this.numOfPages) return;

    this.activePage = page;
    this.resetSelection();
    this.fetchUsers();
  }

  showAddNewUser() {
    // probably better to redirect to register page
    this.isAddNewUserDialogActive = true;
  }

  hideAddNewUser() {
    this.isAddNewUserDialogActive = true;
  }

  resetSelection() {
    this.selectedIndex = null;
      this.selectedUser = null;
  }

  setActive(index): void {
    if(this.selectedIndex == index) {
      if(!this.editMode) {
        this.resetSelection();
      }
      return;
    }

    this.selectedIndex = index;
    this.selectedUser = User.clone(this.allUsers[index]);
  }

  showActionButtons() {
    return !this.editMode && this.selectedIndex != null && this.selectedIndex != undefined;
  }

  showEditField(index): boolean {
    return this.editMode && this.selectedIndex == index;
  }

  hideDeleteDialog() {
    this.deleteMode = false;
  }

  showDeleteDialog() {
    this.deleteMode = true;
  }

  getImageSrc(index: number): string {
    const user = this.allUsers[index];
    if(user.imageType) {
      return `${GlobalConstants.URI}/images/${user.username}/profileImg${user.imageType}`;
    }

    return user.type == GlobalConstants.AGENCY_TYPE ? "assets/agency-default.png" : "assets/user-default.png";
  }

  activateEditMode() { 
    if(this.selectedIndex == undefined || this.selectedIndex == null) return;

    this.selectedUser = User.clone(this.allUsers[this.selectedIndex]);
    this.editMode = true;
  }
  
  discardEdit() {
    this.editMode = false;
    this.selectedUser = User.clone(this.allUsers[this.selectedIndex]);
  }

  submitEdit() {
    this.editMode = false;    
    this.updateUser();    
  }

  updateUser() {
    const originalUser: User = this.allUsers[this.selectedIndex];

    if(this.selectedUser.type == GlobalConstants.AGENCY_TYPE) {
      this.userService.updateAgencyData(originalUser.username, originalUser.jwt, this.selectedUser.phone, this.selectedUser.mail, 
                                          this.selectedUser.name, this.selectedUser.address, this.selectedUser.description, this.selectedUser.username)
      .subscribe({
        next: (updatedUser: User) => {
          this.allUsers[this.selectedIndex] = updatedUser;
          this.selectedUser = User.clone(updatedUser);
          this.displaySuccessfulToast("Uspešno ažurirani podaci korisnika.");
        },
        error: (res) => {
          if(res.error.errMsg) {
            this.displayErrorToast(res.error.errMsg);
          } else {
            this.displayErrorToast("Došlo je do greške prilikom ažuriranja podataka. Pokušajte ponovo.");
          }
        }
      });

    } else {
      this.userService.updateClientData(originalUser.username, originalUser.jwt, this.selectedUser.phone, this.selectedUser.mail, 
                                          this.selectedUser.firstname, this.selectedUser.lastname, this.selectedUser.username)
      .subscribe({
        next: (updatedUser: User) => {
          this.allUsers[this.selectedIndex] = updatedUser;
          this.selectedUser = User.clone(updatedUser);
          this.displaySuccessfulToast("Uspešno ažurirani podaci korisnika.");
        },
        error: (res) => {
          if(res.error.errMsg) {
            this.displayErrorToast(res.error.errMsg);
          } else {
            this.displayErrorToast("Došlo je do greške prilikom ažuriranja podataka. Pokušajte ponovo.");
          }
        }
      });
    }
  }

  deleteUser() {
    this.hideDeleteDialog();
    this.showLoadingDialog("Brisanje korisnika...");

    this.userService.deleteUserById(this.loggedAdmin.jwt, this.selectedUser._id)
    .subscribe({
      next: () => {
        this.allUsers.splice(this.selectedIndex, 1);
        this.fetchUsers();
        this.selectedIndex = null;
        this.selectedUser = null;
        this.hideLoadingDialog();
        this.displaySuccessfulToast("Korisnik uspešno obirsan.");
      },
      error: (res) => {
        this.displayErrorToast("Došlo je do greške prilikom brisanja korisnika. Pokušajte ponovo.");
        this.hideLoadingDialog();
      }
    });
  }

}
