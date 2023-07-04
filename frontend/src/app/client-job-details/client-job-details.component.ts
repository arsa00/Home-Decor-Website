import { Component, OnInit } from '@angular/core';
import { Job, JobState } from '../models/Job';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../services/job.service';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-client-job-details',
  templateUrl: './client-job-details.component.html',
  styleUrls: ['./client-job-details.component.css']
})
export class ClientJobDetailsComponent implements OnInit {

  loggedUser: User;
  job: Job;

  constructor(private route: ActivatedRoute,
              private jobService: JobService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    const jobID = this.route.snapshot.paramMap.get("jobID");
    this.jobService.getJobByID(this.loggedUser.jwt, jobID).subscribe({
      next: (job: Job) => {
        this.job = job;
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
      case JobState.ACTIVE: return "Aktivan posao";
      case JobState.FINISHED: return "Završen posao";
      case JobState.CANCELED: return "Otkazan posao";
      case JobState.PENDING: return "Zahtev za saradnju. Čeka se odgovor agencije.";
      case JobState.ACCEPTED: return "Zahtev za saradnju prihvaćen od strane agencije.";
      case JobState.REJECTED: return "Zahtev za saradnju odbijen od strane agencije.";
      default: return "-";
    }
  }

}
