import { Component, OnInit } from '@angular/core';
import { AgencyRequest } from '../models/AgencyRequest';
import { AgencyService } from '../services/agency.service';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import * as bootstrap from 'bootstrap';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-agency-employees',
  templateUrl: './admin-agency-employees.component.html',
  styleUrls: ['./admin-agency-employees.component.css']
})
export class AdminAgencyEmployeesComponent implements OnInit {

  loggedAdmin: User;
  agency: User;

  allRequests: AgencyRequest[] = [];

  errToastMsg: string;
  succToastMsg: string;

  constructor(private router: Router,
              private agencyService: AgencyService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.loggedAdmin = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_ADMIN));
    this.agency = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    this.agencyService.getAllAgencyRequestsByAgencyId(this.loggedAdmin.jwt, this.agency._id)
    .subscribe({
      next: (allReqs: AgencyRequest[]) => {
        this.allRequests = allReqs;
      },
      error: () => {

      }
    });
  }

  displayErrorToast(msg: string) {
    this.errToastMsg = msg;
    new bootstrap.Toast(document.getElementById("err0")).show(); 
  }

  displaySuccessfulToast(msg: string) {
    this.succToastMsg = msg;
    new bootstrap.Toast(document.getElementById("succ0")).show(); 
  }

  acceptReq(index: number) {
    const req = this.allRequests[index];

    this.agencyService.acceptAgencyRequest(this.loggedAdmin.jwt, req._id).subscribe({
      next: (updatedAgency: User) => {
        updatedAgency.jwt = this.agency.jwt;
        this.agency = updatedAgency;
        localStorage.setItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER, JSON.stringify(updatedAgency));
        // this.allRequests.splice(index, 1);
        this.displaySuccessfulToast("Zahtev uspešno prihvaćen.");
        setTimeout(() => {
          location.reload();
        }, 750);
      },
      error: () => {
        this.displayErrorToast("Došlo je do greške. Pokušajte ponovo.");
      }
    });
  }

  rejectReq(index: number) {
    const req = this.allRequests[index];

    this.agencyService.rejectAgencyRequest(this.loggedAdmin.jwt, req._id).subscribe({
      next: (updatedAgency: User) => {
        this.allRequests.splice(index, 1);
        this.displaySuccessfulToast("Zahtev uspešno odbijen.");
      },
      error: () => {
        this.displayErrorToast("Došlo je do greške. Pokušajte ponovo.");
      }
    });
  }

  returnToHomePage() {
    this.router.navigate([GlobalConstants.ROUTE_ADMIN_DASHBOARD]);
  }

  returnToUserList() {
    this.router.navigate([GlobalConstants.ROUTE_ADMIN_USER_LIST]);
  }

  logoutAdmin() {
    this.userService.logout();
    this.router.navigate([GlobalConstants.ROUTE_LOGIN]);
  }
}
