import { Component, OnInit } from '@angular/core';
import { Job, JobState } from '../models/Job';
import { User } from '../models/User';
import { JobService } from '../services/job.service';
import * as bootstrap from 'bootstrap';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

  loggedUser: User;

  allJobs: Job[] = [];


  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    this.jobService.getAllClientJobs(this.loggedUser.jwt, this.loggedUser._id).subscribe({
      next: (jobs: Job[]) => {
        this.allJobs = jobs;
       },
      error: () => { new bootstrap.Toast(document.getElementById("err")).show(); }
    });

  }

  printJobState(job: Job): string {
    switch(job.state) {
      case JobState.ACTIVE: return "Aktivan posao";
      case JobState.FINISHED: return "Završen posao";
      case JobState.CANCELED: return "Otkazan posao";
      default: return "Zahtev za saradnju";
    }
  }
  
  isJobActive(job: Job): boolean {
    return job.state === JobState.ACTIVE;
  }

  isJobReq(job: Job): boolean {
    return job.state === JobState.ACCEPTED 
            || job.state === JobState.PENDING 
            || job.state === JobState.REJECTED; 
  }

  isJobRejected(job: Job): boolean {
    return job.state === JobState.REJECTED; 
  }

  isJobAccepted(job: Job): boolean {
    return job.state === JobState.ACCEPTED; 
  }

  isJobFinished(job: Job): boolean {
    return job.state === JobState.FINISHED;
  }

  isJobCanceled(job: Job): boolean {
    return job.state === JobState.CANCELED;
  }

  getFormattedDate(date: Date): string {
    const validDate = new Date(date);
    return `${validDate.getDate()}.${validDate.getMonth() + 1}.${validDate.getFullYear()}`;
  }

}
