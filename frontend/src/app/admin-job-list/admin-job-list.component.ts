import { Component, OnInit } from '@angular/core';
import { Job, JobState } from '../models/Job';
import * as bootstrap from 'bootstrap';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { JobService } from '../services/job.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-admin-job-list',
  templateUrl: './admin-job-list.component.html',
  styleUrls: ['./admin-job-list.component.css']
})
export class AdminJobListComponent implements OnInit {

  static readonly NUM_OF_USERS_PER_PAGE: number = 9;

  readonly ALL_JOB_FILTER = "all";
  readonly CANCEL_REQUEST_JOB_FILTER = "jobCancelReq";

  loggedAdmin: User;

  allJobs: Job[] = [];
  jobStateFilter: string = "all";

  activePage: number = 0;
  numOfPages: number = 0;
  showPage: number[] = [];

  errToastMsg: string;
  succToastMsg: string;

  constructor(private router: Router,
              private jobService: JobService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.loggedAdmin = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_ADMIN));
    document.getElementById("jobStateFilter").addEventListener("change", this.filterJobs);
    this.getNumOfJobsAndFetch();
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

  getFormattedJobState(job: Job): string {
    switch(job?.state) {
      case JobState.ACTIVE: return "Aktivan posao";
      case JobState.FINISHED: return "Završen posao";
      case JobState.CANCELED: return "Otkazan posao";
      case JobState.PENDING: 
      case JobState.ACCEPTED: 
      case JobState.REJECTED: return "Zahtev za saradnju";
      default: return "-";
    }
  }

  isJobCanceled(job: Job): boolean {
    return job?.state === JobState.CANCELED;
  }

  filterJobs = () => {
    switch(this.jobStateFilter) {
      case this.CANCEL_REQUEST_JOB_FILTER: this.getNumOfJobCancelReqsAndFetch(); break;
      case this.ALL_JOB_FILTER: this.getNumOfJobsAndFetch(); break;
    }
  }

  showPageNumbers() {
    return Array(this.numOfPages);
  }

  selectPage(page: number) {
    if(page < 0 || page >= this.numOfPages) return;

    this.activePage = page;
    switch(this.jobStateFilter) {
      case this.CANCEL_REQUEST_JOB_FILTER: this.fetchJobCancelReqs(); break;
      case this.ALL_JOB_FILTER: this.fetchJobs(); break;
    }
  }

  getNumOfJobsAndFetch() {
    this.jobService.getNumberOfJobs(this.loggedAdmin.jwt).subscribe({
      next: (res) => { 
        if(res["numOfJobs"] != null && res["numOfJobs"] != undefined) {
          const numOfJobs = res["numOfJobs"];

          this.numOfPages = Math.floor(numOfJobs / AdminJobListComponent.NUM_OF_USERS_PER_PAGE) 
                          + ((numOfJobs % AdminJobListComponent.NUM_OF_USERS_PER_PAGE) == 0 ? 0 : 1);

          if(this.activePage >= this.numOfPages && this.numOfPages > 0) this.activePage = this.numOfPages - 1;
          this.allJobs = [];
          if(!this.numOfPages) return;
          this.fetchJobs();
        }
      },
      error: () => { this.displayErrorToast("Došlo je do greške. Probajte da osvežite stranicu."); }
    });
  }

  getNumOfJobCancelReqsAndFetch() {
    
    this.jobService.getNumberOfJobCancelRequests(this.loggedAdmin.jwt).subscribe({
      next: (res) => { 
        console.log(res);
        if(res["numOfJobs"] != null && res["numOfJobs"] != undefined) {
          const numOfJobs = res["numOfJobs"];

          this.numOfPages = Math.floor(numOfJobs / AdminJobListComponent.NUM_OF_USERS_PER_PAGE) 
                          + ((numOfJobs % AdminJobListComponent.NUM_OF_USERS_PER_PAGE) == 0 ? 0 : 1);
              
          if(this.activePage >= this.numOfPages && this.numOfPages > 0) this.activePage = this.numOfPages - 1;
          this.allJobs = [];
          if(!this.numOfPages) return;
          this.fetchJobCancelReqs();
        }
      },
      error: () => { this.displayErrorToast("Došlo je do greške. Probajte da osvežite stranicu."); }
    });
  }

  fetchJobs() {
    this.jobService.getSliceOfJobs(this.loggedAdmin.jwt,
                                    this.activePage * AdminJobListComponent.NUM_OF_USERS_PER_PAGE, 
                                    AdminJobListComponent.NUM_OF_USERS_PER_PAGE)
    .subscribe({
      next: (jobs: Job[]) => {
            this.allJobs = jobs;
      },
      error: () => { this.displayErrorToast("Došlo je do greške prilikom dohvatanja poslova. Probajte da osvežite stranicu."); }
    });
  }

  fetchJobCancelReqs() {
    this.jobService.getSliceOfJobCancelRequests(this.loggedAdmin.jwt,
                                    this.activePage * AdminJobListComponent.NUM_OF_USERS_PER_PAGE, 
                                    AdminJobListComponent.NUM_OF_USERS_PER_PAGE)
    .subscribe({
      next: (jobs: Job[]) => {
        this.allJobs = jobs;
      },
      error: () => { this.displayErrorToast("Došlo je do greške prilikom dohvatanja poslova. Probajte da osvežite stranicu."); }
    });
  }

  acceptJobCancelReq(index: number) {
    const job: Job = this.allJobs[index];

    this.jobService.acceptJobCancelRequest(this.loggedAdmin.jwt, job._id).subscribe({
      next: (updatedJob: Job) => { 
        this.allJobs.splice(index, 1);
        this.displaySuccessfulToast("Uspešno prihvaćen zahtev za otkazivanje.");
      },
      error: () => { 
        this.displayErrorToast("Došlo je do greške prilikom prihvatanja zahteva za otkazivanje. Pokušajte ponovo.");
      }
    });
  }

  rejectJobCancelReq(index: number) {
    const job: Job = this.allJobs[index];

    this.jobService.rejectJobCancelRequest(this.loggedAdmin.jwt, job._id).subscribe({
      next: (updatedJob: Job) => { 
        this.allJobs.splice(index, 1);
        this.displaySuccessfulToast("Uspešno odbijen zahtev za otkazivanje.");
      },
      error: () => { 
        this.displayErrorToast("Došlo je do greške prilikom odbijanja zahteva za otkazivanje. Pokušajte ponovo.");
      }
    });
  }

  checkJobDetails(jobId: string) {
    this.router.navigate([`${GlobalConstants.ROUTE_ADMIN_JOB_DETAILS}/${jobId}`]);
  }

  returnToHomePage() {
    this.router.navigate([GlobalConstants.ROUTE_ADMIN_DASHBOARD]);
  }

  logoutAdmin() {
    this.userService.logout();
    this.router.navigate([GlobalConstants.ROUTE_LOGIN]);
  }

}
