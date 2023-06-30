import { Component, OnInit } from '@angular/core';
import { ApartmentSketch } from '../models/ApartmentSketch';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { ApartmentSketchService } from '../services/apartment-sketch.service';

@Component({
  selector: 'app-hire-agency-request',
  templateUrl: './hire-agency-request.component.html',
  styleUrls: ['./hire-agency-request.component.css']
})
export class HireAgencyRequestComponent implements OnInit {

  loggedUser: User;

  allApartments: ApartmentSketch[] = [];
  selectedIndex: number;

  previewIndex: number;
  selectedApartment: ApartmentSketch;

  constructor(private apartmentSketchService: ApartmentSketchService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    this.apartmentSketchService.getAllOwnersApartmentSketches(this.loggedUser.jwt, this.loggedUser._id).subscribe({
      next: (allApartmentSketches: ApartmentSketch[]) => {
        this.allApartments = allApartmentSketches;
        this.selectedIndex = 0;
        this.previewIndex = 0;
        this.selectedApartment = ApartmentSketch.clone(this.allApartments[0]);
        // console.log(allApartmentSketches);
      },
      // error: () => { new bootstrap.Toast(document.getElementById("err")).show(); }
    });
  }

  selectObject(index: number) {
    if(index < 0 || index >= this.allApartments.length) return;

    this.selectedIndex = index;
    this.previewIndex = index;
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[index]);
  }

  previewPrevSketch() {
    this.previewIndex = (this.previewIndex == 0 ? this.allApartments.length : this.previewIndex) - 1;
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[this.previewIndex]);
  }

  previewNextSketch() {
    this.previewIndex = (this.previewIndex == this.allApartments.length - 1 ? -1 : this.previewIndex) + 1;
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[this.previewIndex]);
  }

}
