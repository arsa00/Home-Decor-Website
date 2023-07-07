import { Component, OnInit } from '@angular/core';
import { Job, JobState } from '../models/Job';
import * as bootstrap from 'bootstrap';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { JobService } from '../services/job.service';
import { ApartmentSketch } from '../models/ApartmentSketch';
import { ApartmentSketchService } from '../services/apartment-sketch.service';
import { Employee } from '../models/Employee';
import { AgencyService } from '../services/agency.service';

@Component({
  selector: 'app-agency-job-list',
  templateUrl: './agency-job-list.component.html',
  styleUrls: ['./agency-job-list.component.css']
})
export class AgencyJobListComponent implements OnInit {

  loggedUser: User;

  allJobRequests: Job[] = [];
  selectedIndex: number;

  allActiveJobs: Job[] = [];
  selectedActiveIndex: number;

  allApartments: ApartmentSketch[] = [];
  selectedApartment: ApartmentSketch = null;

  allAvailableEmployees: Employee[] = [];
  selectedEmployeesMap: Map<number, Employee> = new Map<number, Employee>();

  isAssignEmployeesDialogActive: boolean;
  assignEmployeesErrMsgs: string[] = [];

  isAcceptReqDialogActive: boolean = false;
  offer: number = 0;

  offerErr: boolean = false;

  errToastMsg: string;
  succToastMsg: string;

  loadingDialogActive: boolean;
  loadingHeaderTxt: string;

  constructor(private jobService: JobService, 
              private apartmentSketchService: ApartmentSketchService,
              private agencyService: AgencyService) { }

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

    this.agencyService.getAllAvailableEmployeesForAgency(this.loggedUser.jwt, this.loggedUser._id)
    .subscribe({
      next: (allEmployees: Employee[]) => {
        this.allAvailableEmployees = allEmployees;
      },
      error: () => {
        this.displayErrorToast("Došlo je do greške prilikom učitavanja dostupnih radnika. Pokušajte da osvežite stranicu.");
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

  showAssignEmployeesDialog() {
    this.isAssignEmployeesDialogActive = true;
  }

  hideAssignEmployeesDialog() {
    this.isAssignEmployeesDialogActive = false;
    this.selectedEmployeesMap = new Map<number, Employee>();
  }

  toggleEmployeeAssignment(event, index: number) {
    if(event.target.checked) {
      this.selectedEmployeesMap.set(index, this.allAvailableEmployees[index]);
    } else {
      this.selectedEmployeesMap.delete(index);
    }   
  }

  assignEmployees() {
    this.assignEmployeesErrMsgs = [];
    const activeJob = this.allActiveJobs[this.selectedActiveIndex];

    if(this.selectedEmployeesMap.size + activeJob.assignedEmployees.length < this.selectedApartment.roomSketches.length) {
      this.assignEmployeesErrMsgs.push("Morate odabrati minimum jednog radnika po prostoriji");
      return;
    }

    this.isAssignEmployeesDialogActive = false;
    this.showLoadingDialog("Angažovanje radnika...");

    const assignedEmployees = Array.from(this.selectedEmployeesMap.values());
    this.jobService.assignEmployeesToJob(this.loggedUser.jwt, this.loggedUser._id, activeJob._id, assignedEmployees)
    .subscribe({
      next: (updatedJob: Job) => {
        this.agencyService.getAllAvailableEmployeesForAgency(this.loggedUser.jwt, this.loggedUser._id)
        .subscribe({
          next: (allEmployees: Employee[]) => {
            this.allAvailableEmployees = allEmployees;
          },
          error: () => {
            const allIndexesOfAssignedEmpls: number[] = Array.from(this.selectedEmployeesMap.keys());
        
            let removedIndexes: number[] = [];
            for(let index of allIndexesOfAssignedEmpls) {
              let indexToRemoveFrom = index;

              for(let removed of removedIndexes) {
                if(index > removed) indexToRemoveFrom--;
              }

              this.allAvailableEmployees.splice(indexToRemoveFrom, 1);
              removedIndexes.push(index);
            }

            this.displayErrorToast("Došlo je do greške prilikom učitavanja dostupnih radnika. Pokušajte da osvežite stranicu.");
          }
        });

        this.allActiveJobs[this.selectedActiveIndex] = updatedJob;
        this.displaySuccessfulToast("Uspešno angažovanje radnika.");
        this.hideAssignEmployeesDialog();
        this.hideLoadingDialog();
      },
      error: () => {
        this.displayErrorToast("Došlo je do greške prilikom angažovanja radnika. Pokušajte ponovo.");
        this.hideLoadingDialog();
      }
    });
  }

}
