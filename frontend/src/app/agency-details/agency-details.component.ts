import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { ActivatedRoute } from '@angular/router';
import { AgencyService } from '../services/agency.service';
import { GlobalConstants } from '../global-constants';
import { Comment } from '../models/Comment';

@Component({
  selector: 'app-agency-details',
  templateUrl: './agency-details.component.html',
  styleUrls: ['./agency-details.component.css']
})
export class AgencyDetailsComponent implements OnInit {

  loggedUser: User;

  agency: User;
  isLoading: boolean = true;
  isErr: boolean = false;
  imageSrc: string = "assets/agency-default.png";

  allComments: Comment[];

  constructor(private agencyService: AgencyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    try {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));
    } catch(err) {
      this.loggedUser = null;
    }
    const agencyID = this.route.snapshot.paramMap.get("agencyID");
    this.agencyService.getAgency(agencyID).subscribe({
      next: (agency: User) => {
        this.agency = agency;
        if(this.agency.imageType) {
          this.imageSrc = `${GlobalConstants.URI}/images/${this.agency.username}/profileImg${this.agency.imageType}`; 
        }

        if(this.isAnonymous()) {
          this.agencyService.getAllAnonymousComments(agencyID).subscribe({
            next: (comments: Comment[]) => {
              this.allComments = comments;
              this.isErr = false;
              this.isLoading = false;
            },
            
            error: () => { this.isErr = true; this.isLoading = false; }
          });
        } else {
          this.agencyService.getAllComments(this.loggedUser.jwt, agencyID).subscribe({
            next: (comments: Comment[]) => {
              this.allComments = comments;
              this.isErr = false;
              this.isLoading = false;
            },
            
            error: () => { this.isErr = true; this.isLoading = false; }
          });
        }
      },
      error: () => { this.isErr = true; this.isLoading = false; }
    });
  }

  isAnonymous(): boolean {
    return this.loggedUser == null;
  }

}
