import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { AgencyService } from '../services/agency.service';
import * as bootstrap from 'bootstrap';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.css']
})
export class GuestPageComponent implements OnInit {

  loggedUser: User;

  agencySearchResults: User[] = [];
  searchParam: string = "name";
  searchTerm: string = "";

  sortParam: string = "name";
  sortDir: number = 1;

  isSearching: boolean = false;

  constructor(private agencyService: AgencyService) { }

  ngOnInit(): void {
    try {
      this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));
    } catch(err) {
      this.loggedUser = null;
    }
  }

  search(): void {
    this.isSearching = true;
    let searchName: boolean = false;
    let searchAddress: boolean = false;

    switch(this.searchParam) {
      case "name": { searchName = true; break; }
      case "address": { searchAddress = true; break; }
      case "both": { searchName = true; searchAddress = true; break; }
    }

    this.agencyService.getAgencies(this.searchTerm, searchName, searchAddress).subscribe({
      next: (agencies: User[]) => {
        this.agencySearchResults = agencies;
        this.isSearching = false;
      },

      error: () => {
        new bootstrap.Toast(document.getElementById("searchErr")).show();
        this.isSearching = false;
      }
    });
  }

  sort(): void {
    this.agencySearchResults.sort((agency1: User, agency2: User) => {
      if(this.sortParam == "name") {
        if(agency1.name < agency2.name) return -this.sortDir;
        else if(agency1.name === agency2.name) return 0;
        else return this.sortDir;
      } else {
        if(agency1.address < agency2.address) return -this.sortDir;
        else if(agency1.address === agency2.address) return 0;
        else return this.sortDir;
      }
    })
  }

  isAnonymous(): boolean {
    return this.loggedUser == null;
  }

}
