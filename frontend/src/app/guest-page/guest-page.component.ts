import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';

@Component({
  selector: 'app-guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.css']
})
export class GuestPageComponent implements OnInit {

  static agency1: User = {
    username: "Arsa",
    password: "123",
    type: "agency",
    mail: "mail@m.com",
    jwt: "jwt token",
    name: "Naziv agencije 1",
    description: "Opis agencije koji moze biti poduzi i u \n par redova",
    address: "Adresa agencije 22",
    // imageType: ".png"
  }

  static agency2: User = {
    username: "Arsa",
    password: "123",
    type: "agency",
    mail: "mail@m.com",
    jwt: "jwt token",
    name: "Naziv agencije 2",
    description: "Opis agencije koji moze biti poduzi i u \n par redova",
    address: "Adresa agencije 21",
    imageType: ".png"
  }

  agencySearchResults: User[] = [GuestPageComponent.agency1, GuestPageComponent.agency1, GuestPageComponent.agency1, GuestPageComponent.agency2, GuestPageComponent.agency2 ];
  searchParam: string = "name";
  searchTerm: string;

  sortParam: string = "name";
  sortDir: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  search(): void {

  }

  sort(): void {
    this.agencySearchResults.sort((agency1: User, agency2: User) => {
      if(this.sortParam == "name") {
        if(agency1.name < agency2.name) return -this.sortDir;
        else if(agency1.name === agency2.name) return 0;
        else return this.sortDir;
      } else {
        if(agency1.address < agency2.address) return -this.sortDir;
        else if(agency1.address === agency2.address) return 0;
        else return this.sortDir;
      }
    })
  }

}
