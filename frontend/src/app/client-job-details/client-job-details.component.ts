import { Component, OnInit } from '@angular/core';
import { Job, JobState } from '../models/Job';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../services/job.service';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import * as bootstrap from 'bootstrap';
import { ApartmentSketch, ProgressState } from '../models/ApartmentSketch';
import { ApartmentSketchService } from '../services/apartment-sketch.service';
import { AgencyService } from '../services/agency.service';
import { Comment } from '../models/Comment';

@Component({
  selector: 'app-client-job-details',
  templateUrl: './client-job-details.component.html',
  styleUrls: ['./client-job-details.component.css']
})
export class ClientJobDetailsComponent implements OnInit {

  loggedUser: User;

  job: Job;
  objectUnderConstruction: ApartmentSketch;
  comment: Comment;
  
  cancelJobMode: boolean = false;
  cancelMsg: string;
  cancelMsgErr: boolean = false;

  succToastMsg: string;
  errToastMsg: string;

  addCommentMode: boolean = false;
  commentTxt: string;
  grade: number = 0;
  commentGradeErrMsgs: string[] = [];

  constructor(private route: ActivatedRoute,
              private jobService: JobService,
              private apartmentSketchService: ApartmentSketchService,
              private agencyService: AgencyService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    const jobID = this.route.snapshot.paramMap.get("jobID");
    this.jobService.getJobByID(this.loggedUser.jwt, jobID).subscribe({
      next: (job: Job) => {
        this.job = job;

        this.apartmentSketchService.getApartmentSketchByID(this.loggedUser.jwt, job.objectID).subscribe({
          next: (apartmentSketch: ApartmentSketch) => {
            this.objectUnderConstruction = apartmentSketch;
          },
          error: () => { this.displayErrorToast("Došlo je do greške prilikom dohvatanja skice objekta. Pokušajte ponovo."); }
        });
      },
      error: () => { this.displayErrorToast("Došlo je do greške. Pokušajte ponovo."); }
    });

    this.agencyService.getCommentByJobId(this.loggedUser.jwt, jobID).subscribe({
      next: (comment: Comment) => { this.comment = comment; },
      error: () => { this.comment = undefined; }
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

  areAllRoomsFinished(): boolean {
    if(!this.objectUnderConstruction 
        || !this.objectUnderConstruction.roomSketches 
        || !this.objectUnderConstruction.roomSketches.length) {
      return false;
    }

    let finished: boolean = true;

    for(let rs of this.objectUnderConstruction.roomSketches) {
      if(rs.progress != ProgressState.FINISHED) {
        finished = false;
        break;
      }
    }

    return finished;
  }

  showCancelDialog() {
    this.cancelJobMode = true;
  }

  hideCancelDialog() {
    this.cancelJobMode = false;
    this.cancelMsgErr = false;
  }

  showAddCommentDialog() {
    if(this.comment) {
      this.commentTxt = this.comment.comment;
      this.grade = this.comment.grade;
    }

    this.addCommentMode = true;
  }

  hideAddCommentDialog() {
    this.addCommentMode = false;
    this.commentTxt = undefined;
    this.grade = 0;
  }

  isCommentPublished(): boolean {
    return !!this.comment;
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
        this.displaySuccessfulToast("Zahtev za otkazivanje posla uspešno poslat.");
        setTimeout(() => {
          window.location.reload();
        }, 750);
      },
      error: () => { this.displayErrorToast("Došlo je do greške prilikom slanja zahteva. Pokušajte ponovo."); }
    });
  }

  payAgency() {
    console.log("isplata...");

    // payment logic would go here... (flow should be continued only if payment was successful)

    this.jobService.updateJob(this.loggedUser.jwt, this.job._id, JobState.FINISHED).subscribe({
      next: () => { 
        this.displaySuccessfulToast("Plaćanje uspešno izvršeno.");
        setTimeout(() => {
          window.location.reload();
        }, 750);
      },
      error: () => { this.displayErrorToast("Došlo je do greške prilikom plaćanja. Pokušajte ponovo."); }
    });
  }

  allGrades(): Array<number> {
    return Array(5);
  }

  setGrade(grade: number) {
    this.grade = grade + 1;
    console.log(this.grade);
  }

  addComment() {
    this.commentGradeErrMsgs = [];
    let isErrCathced: boolean = false;

    if(!this.commentTxt) {
      this.commentGradeErrMsgs.push("Unesite komentar");
      isErrCathced = true;
    }

    if(!this.grade) {
      this.commentGradeErrMsgs.push("Odaberite ocenu");
      isErrCathced = true;
    }

    if(isErrCathced) return;

    // send comment&grade to server...
    if(!this.comment) {
      this.agencyService
          .addComment(this.loggedUser.jwt, this.job._id, this.commentTxt, this.grade, this.loggedUser._id)
          .subscribe({

        next: (addedComment: Comment) => {
          this.comment = addedComment;
          this.displaySuccessfulToast("Komentar i ocena uspešno objavljeni.");
          this.hideAddCommentDialog();
        },
        error: () => {
          this.displayErrorToast("Došlo je do greške prilikom objavljivanja komentara i ocene. Pokušajte ponovo.");
        },

      });
    } else {
      this.agencyService
          .updateComment(this.loggedUser.jwt, this.comment._id, this.loggedUser.username, this.commentTxt, this.grade)
          .subscribe({

        next: (updatedComment: Comment) => {
          this.comment = updatedComment;
          this.displaySuccessfulToast("Komentar i ocena uspešno izmenjeni.");
          this.hideAddCommentDialog();
        },
        error: () => {
          this.displayErrorToast("Došlo je do greške prilikom izmene komentara i ocene. Pokušajte ponovo.");
        },

      });
    }
  }

}
