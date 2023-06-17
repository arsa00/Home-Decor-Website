import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-agency-search-card',
  templateUrl: './agency-search-card.component.html',
  styleUrls: ['./agency-search-card.component.css']
})
export class AgencySearchCardComponent implements OnInit {

  @Input() agency: User = {
    username: "Arsa",
    password: "123",
    type: "agency",
    mail: "mail@m.com",
    jwt: "jwt token",
    name: "Naziv agencije",
    description: "Opis agencije koji moze biti poduzi i u \n par redova",
    address: "Adresa agencije",
    // imageType: ".png"
  }

  imageSrc: string = "assets/agency-default.png";

  constructor() { }

  ngOnInit(): void {
    if(this.agency.imageType) {
      this.imageSrc = `${GlobalConstants.URI}/images/${this.agency.username}/profileImg${this.agency.imageType}`;
    }
  }

}
