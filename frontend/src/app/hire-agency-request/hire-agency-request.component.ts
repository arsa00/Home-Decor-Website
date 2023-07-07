import { Component, Input, OnInit } from '@angular/core';
import { ApartmentSketch } from '../models/ApartmentSketch';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { ApartmentSketchService } from '../services/apartment-sketch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../services/job.service';
import * as bootstrap from 'bootstrap'
import { Job } from '../models/Job';

@Component({
  selector: 'app-hire-agency-request',
  templateUrl: './hire-agency-request.component.html',
  styleUrls: ['./hire-agency-request.component.css']
})
export class HireAgencyRequestComponent implements OnInit {

  agencyID: string;
  agencyName: string;
  loggedUser: User;

  allApartments: ApartmentSketch[] = [];
  selectedIndex: number;

  previewIndex: number;
  selectedApartment: ApartmentSketch;

  startJobDate: Date;
  endJobDate: Date;

  errMessages: string[] = [];
  isWaitingForResposne: boolean = false;

  constructor(private apartmentSketchService: ApartmentSketchService,
              private jobService: JobService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));
    this.agencyID = this.route.snapshot.paramMap.get("agencyID");
    this.agencyName = this.route.snapshot.paramMap.get("agencyName");

    this.apartmentSketchService.getAllOwnersApartmentSketches(this.loggedUser.jwt, this.loggedUser._id).subscribe({
      next: (allApartmentSketches: ApartmentSketch[]) => {
        this.allApartments = allApartmentSketches;
        this.selectedIndex = 0;
        this.previewIndex = 0;
        this.selectedApartment = ApartmentSketch.clone(this.allApartments[0]);
        // console.log(allApartmentSketches);
      },
      // error: () => { new bootstrap.Toast(document.getElementById("err")).show(); }
    });
  }

  selectObject(index: number) {
    if(index < 0 || index >= this.allApartments.length) return;

    this.selectedIndex = index;
    this.previewIndex = index;
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[index]);
  }

  previewPrevSketch() {
    this.previewIndex = (this.previewIndex == 0 ? this.allApartments.length : this.previewIndex) - 1;
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[this.previewIndex]);
  }

  previewNextSketch() {
    this.previewIndex = (this.previewIndex == this.allApartments.length - 1 ? -1 : this.previewIndex) + 1;
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[this.previewIndex]);
  }

  submitRequest() {
    this.errMessages = [];
    const startJobDateEl: any = document.getElementById("startJobDate");
    const endJobDateEl: any = document.getElementById("endJobDate");

    this.startJobDate = new Date(startJobDateEl.value);
    this.endJobDate = new Date(endJobDateEl.value);

    let isErrorCatched: boolean;

    if(Number.isNaN(this.startJobDate.getTime())) {
      isErrorCatched = true;
      this.errMessages.push("Datum početka radova nije validan.");
    }

    if(Number.isNaN(this.endJobDate.getTime())) {
      isErrorCatched = true;
      this.errMessages.push("Datum kraja radova nije validan.");
    }

    if(!this.allApartments || !this.allApartments.length) {
      isErrorCatched = true;
      this.errMessages.push("Nemate nijedan objekat.");
    }

    if(!this.selectedApartment?.roomSketches || !this.selectedApartment?.roomSketches.length) {
      isErrorCatched = true;
      this.errMessages.push("Nemate ni jednu prostoriju u objektu.");
    }

    if(!this.selectObject) {
      isErrorCatched = true;
      this.errMessages.push("Objekat mora biti izabran.");
    }

    if(isErrorCatched) return;

    if(this.endJobDate <= this.startJobDate) {
      this.errMessages.push("Datum kraja radova mora biti nakon datuma početka radova.");
      return;
    }

    // create new job request
    const pickedObject = this.allApartments[this.selectedIndex];
    this.isWaitingForResposne = true;
    const newJob: Job = new Job(this.loggedUser._id, this.agencyID, this.agencyName, 
                                pickedObject._id, pickedObject.type, pickedObject.address,
                                this.startJobDate, this.endJobDate, this.loggedUser.firstname,
                                this.loggedUser.lastname, this.loggedUser.phone, this.loggedUser.mail);

    this.jobService.addJob(this.loggedUser.jwt, newJob).subscribe({
      next: () => { 
        this.isWaitingForResposne = false;
        sessionStorage.setItem(GlobalConstants.SESSION_STORAGE_JOB_ADDED, "true");
        this.returnToAgencyDetailsPage();
      },
      error: () => { 
        this.isWaitingForResposne = false; 
        new bootstrap.Toast(document.getElementById("err")).show(); 
      }
    });
  }

  returnToAgencyDetailsPage() {
    this.router.navigate([`${GlobalConstants.ROUTE_GUEST_AGENCY_DETAILS}/${this.agencyID}`]);
  }

}
