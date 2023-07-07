import { Component, OnInit } from '@angular/core';
import { Job, JobState } from '../models/Job';
import * as bootstrap from 'bootstrap';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { JobService } from '../services/job.service';
import { ApartmentSketch } from '../models/ApartmentSketch';
import { ApartmentSketchService } from '../services/apartment-sketch.service';

@Component({
  selector: 'app-agency-job-list',
  templateUrl: './agency-job-list.component.html',
  styleUrls: ['./agency-job-list.component.css']
})
export class AgencyJobListComponent implements OnInit {

  // dummy data

  static readonly job1 = new Job("32,", "22", "Agencija ime", "1519", "Kuca", "Adresa", new Date("2023-07-06"), 
                                new Date("2022-07-07"), "Ime klijenta", "Prezime klijenta", "+381 61/ 000 - 00", "klijent@mejl.rs");

  // delete dummy data above

  loggedUser: User;

  allJobRequests: Job[] = [];
  selectedIndex: number;

  allActiveJobs: Job[] = [];
  selectedActiveIndex: number;
  allApartments: ApartmentSketch[] = [];
  selectedApartment: ApartmentSketch = null;

  isAcceptReqDialogActive: boolean = false;
  offer: number = 0;

  offerErr: boolean = false;

  errToastMsg: string;
  succToastMsg: string;

  loadingDialogActive: boolean;
  loadingHeaderTxt: string;

  constructor(private jobService: JobService, private apartmentSketchService: ApartmentSketchService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    this.jobService.getAgencyJobsWithState(this.loggedUser.jwt, this.loggedUser._id, JobState.PENDING)
    .subscribe({
      next: (allJobReqs: Job[]) => {
        this.allJobRequests = allJobReqs;
      },
      error: () => { 
        this.displayErrorToast("Došlo je do greške prilikom učitavanja zahteva. Pokušajte da osvežite stranicu.");
      }
    });

    this.jobService.getAgencyJobsWithState(this.loggedUser.jwt, this.loggedUser._id, JobState.ACTIVE)
    .subscribe({
      next: (allActiveJobs: Job[]) => {
        console.log(allActiveJobs);
        this.allActiveJobs = allActiveJobs;
        this.selectedActiveIndex = 0;

        const objectIds = Array.from(this.allActiveJobs.map((job: Job) => {
          return job.objectID;
        }));

        this.apartmentSketchService.getMultipleApartmentSketchesByIds(this.loggedUser.jwt, objectIds)
        .subscribe({
          next: (allAs: ApartmentSketch[]) => {
            this.allApartments = allAs; 
            this.changeSelectedApartment();
          },
          error: () => {
            this.displayErrorToast("Došlo je do greške prilikom učitavanja skica objekata. Pokušajte da osvežite stranicu.");
          }
        });
      },
      error: () => { 
        this.displayErrorToast("Došlo je do greške prilikom učitavanja aktivnih poslova. Pokušajte da osvežite stranicu.");
      }
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

  getFormattedDate(date: Date): string {
    const validDate = new Date(date);
    return `${validDate.getDate()}.${validDate.getMonth() + 1}.${validDate.getFullYear()}`;
  }

  hideLoadingDialog() {
    this.loadingDialogActive = false;
  }

  private showLoadingDialog(msg: string) {
    this.loadingHeaderTxt = msg;
    this.loadingDialogActive = true;
  }

  showAcceptReqDialog(index: number) {
    if(index < 0 || index >= this.allJobRequests.length) return;

    this.isAcceptReqDialogActive = true;
    this.selectedIndex = index;
  }

  hideAcceptReqDialog() {
    this.isAcceptReqDialogActive = false;
    this.offerErr = false;
    this.offer = 0;
  }

  acceptReq() {
    this.offerErr = false;

    if(!this.offer || this.offer < 0) {
      this.offerErr = true;
      return
    }

    this.isAcceptReqDialogActive = false;
    this.showLoadingDialog("Prihvatanje zahteva...");

    const selectedJob = this.allJobRequests[this.selectedIndex];
    this.jobService.updateJob(this.loggedUser.jwt, selectedJob._id, JobState.ACCEPTED, undefined, undefined, this.offer)
    .subscribe({
      next: () => {
        this.allJobRequests.splice(this.selectedIndex, 1);
        this.displaySuccessfulToast("Uspešno prihvaćen zahtev. Čeka se odgvor klijenta.");
        this.hideLoadingDialog();
        this.hideAcceptReqDialog();
      },
      error: () => { 
        this.displayErrorToast("Došlo je do greške prilikom prihvatanja zahteva. Pokušajte ponovo.");
        this.hideLoadingDialog();
      }
    });
  }

  rejectReq(index: number) {
    if(index < 0 || index >= this.allJobRequests.length) return;
    this.selectedIndex = index;

    this.showLoadingDialog("Odbijanje zahteva...");

    const selectedJob = this.allJobRequests[this.selectedIndex];
    this.jobService.updateJob(this.loggedUser.jwt, selectedJob._id, JobState.REJECTED)
    .subscribe({
      next: () => {
        this.allJobRequests.splice(this.selectedIndex, 1);
        this.displaySuccessfulToast("Uspešno odbijen zahtev.");
        this.hideLoadingDialog();
        this.hideAcceptReqDialog();
      },
      error: () => { 
        this.displayErrorToast("Došlo je do greške prilikom odbijanja zahteva. Pokušajte ponovo.");
        this.hideLoadingDialog();
      }
    });
  }

  previewPrevSketch() {
    this.selectedActiveIndex = (this.selectedActiveIndex == 0 ? this.allApartments.length : this.selectedActiveIndex) - 1;
    this.changeSelectedApartment();
  }

  previewNextSketch() {
    this.selectedActiveIndex = (this.selectedActiveIndex == this.allApartments.length - 1 ? -1 : this.selectedActiveIndex) + 1;
    this.changeSelectedApartment();
  }

  changeSelectedApartment() {
    if(!this.allApartments || !this.allApartments.length) {
      this.selectedApartment = null;
      return;
    }

    this.selectedApartment = ApartmentSketch.clone( this.allApartments.find((object: ApartmentSketch) => {
      return object._id == this.allActiveJobs[this.selectedActiveIndex].objectID;
    }));
  }

}
