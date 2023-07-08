import { Component, OnInit } from '@angular/core';
import { AgencyRequest } from '../models/AgencyRequest';
import { AgencyService } from '../services/agency.service';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-admin-agency-employees',
  templateUrl: './admin-agency-employees.component.html',
  styleUrls: ['./admin-agency-employees.component.css']
})
export class AdminAgencyEmployeesComponent implements OnInit {

  loggedAdmin: User;
  agency: User;

  allRequests: AgencyRequest[] = [];

  constructor(private agencyService: AgencyService) { }

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

  acceptReq(index: number) {
    const req = this.allRequests[index];

    this.agencyService.acceptAgencyRequest(this.loggedAdmin.jwt, req._id).subscribe({
      next: (updatedAgency: User) => {
        updatedAgency.jwt = this.agency.jwt;
        this.agency = updatedAgency;
        localStorage.setItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER, JSON.stringify(updatedAgency));
        // this.allRequests.splice(index, 1);
        location.reload();
      },
      error: () => {

      }
    });
  }

  rejectReq(index: number) {
    const req = this.allRequests[index];

    this.agencyService.rejectAgencyRequest(this.loggedAdmin.jwt, req._id).subscribe({
      next: (updatedAgency: User) => {
        this.allRequests.splice(index, 1);
      },
      error: () => {

      }
    });
  }
}
