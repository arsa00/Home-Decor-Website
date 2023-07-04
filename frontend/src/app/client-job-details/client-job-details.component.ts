import { Component, OnInit } from '@angular/core';
import { Job, JobState } from '../models/Job';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../services/job.service';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import * as bootstrap from 'bootstrap';
import { ApartmentSketch } from '../models/ApartmentSketch';
import { ApartmentSketchService } from '../services/apartment-sketch.service';

@Component({
  selector: 'app-client-job-details',
  templateUrl: './client-job-details.component.html',
  styleUrls: ['./client-job-details.component.css']
})
export class ClientJobDetailsComponent implements OnInit {

  loggedUser: User;

  job: Job;
  objectUnderConstruction: ApartmentSketch;
  
  cancelJobMode: boolean = false;
  cancelMsg: string;
  cancelMsgErr: boolean = false;

  constructor(private route: ActivatedRoute,
              private jobService: JobService,
              private apartmentSketchService: ApartmentSketchService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    const jobID = this.route.snapshot.paramMap.get("jobID");
    this.jobService.getJobByID(this.loggedUser.jwt, jobID).subscribe({
      next: (job: Job) => {
        this.job = job;

        console.log(job);

        this.apartmentSketchService.getApartmentSketchByID(this.loggedUser.jwt, job.objectID).subscribe({
          next: (apartmentSketch: ApartmentSketch) => {
            this.objectUnderConstruction = apartmentSketch;
          },
          error: () => { new bootstrap.Toast(document.getElementById("objectErr")).show(); }
        });
      },
      error: () => { new bootstrap.Toast(document.getElementById("err")).show(); }
    });
  }

  getFormattedStartDate(): string {
    const validDate = new Date(this.job.startDate);
    return `${validDate.getDate()}.${validDate.getMonth() + 1}.${validDate.getFullYear()}`;
  }

  getFormattedEndDate(): string {
    const validDate = new Date(this.job.endDate);
    return `${validDate.getDate()}.${validDate.getMonth() + 1}.${validDate.getFullYear()}`;
  }

  getFormattedJobState(): string {
    switch(this.job.state) {
      case JobState.ACTIVE: return ("Aktivan posao" + (this.job.cancelRequested ? ". Zahtev za otkazivanje na čekanju." : ""));
      case JobState.FINISHED: return "Završen posao";
      case JobState.CANCELED: return "Otkazan posao";
      case JobState.PENDING: return "Zahtev za saradnju. Čeka se odgovor agencije.";
      case JobState.ACCEPTED: return "Zahtev za saradnju prihvaćen od strane agencije.";
      case JobState.REJECTED: return "Zahtev za saradnju odbijen od strane agencije.";
      default: return "-";
    }
  }

  isJobActive(): boolean {
    return this.job.state === JobState.ACTIVE;
  }

  isJobReq(): boolean {
    return this.job.state === JobState.ACCEPTED 
            || this.job.state === JobState.PENDING 
            || this.job.state === JobState.REJECTED; 
  }

  isJobRejected(): boolean {
    return this.job.state === JobState.REJECTED; 
  }

  isJobAccepted(): boolean {
    return this.job.state === JobState.ACCEPTED; 
  }

  isJobFinished(): boolean {
    return this.job.state === JobState.FINISHED;
  }

  isJobCanceled(): boolean {
    return this.job.state === JobState.CANCELED;
  }

  showCancelDialog() {
    this.cancelJobMode = true;
  }

  hideCancelDialog() {
    this.cancelJobMode = false;
    this.cancelMsgErr = false;
  }

  cancelJob() {
    if(!this.cancelMsg) {
      this.cancelMsgErr = true;
      return;
    }

    this.hideCancelDialog();

    if(this.job.state !== JobState.ACTIVE || this.job.cancelRequested) return;

    this.jobService.updateJob(this.loggedUser.jwt, this.job._id, undefined, true, this.cancelMsg).subscribe({
      next: () => { 
        new bootstrap.Toast(document.getElementById("cancelReqSucc")).show(); 
        setTimeout(() => {
          window.location.reload();
        }, 750);
      },
      error: () => { new bootstrap.Toast(document.getElementById("err")).show(); }
    });
  }

}
