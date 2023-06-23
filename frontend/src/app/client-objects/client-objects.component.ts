import { Component, OnInit } from '@angular/core';
import { ApartmentSketch, ObjectType } from '../models/ApartmentSketch';
import { ApartmentSketchComponent } from '../apartment-sketch/apartment-sketch.component';

@Component({
  selector: 'app-client-objects',
  templateUrl: './client-objects.component.html',
  styleUrls: ['./client-objects.component.css']
})
export class ClientObjectsComponent implements OnInit {

  allApartments: ApartmentSketch[] = [];
  selectedIndex: number;
  selectedApartment: ApartmentSketch;

  editMode: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.allApartments.push(new ApartmentSketch(0.5, ObjectType.APARTMENT, "Adresa stana 1/2, Beograd 11000", 52));
    this.allApartments.push(new ApartmentSketch(0.5, ObjectType.HOUSE, "Adresa stana 2/2, Beograd 11000", 92));
  }

  setActive(index): void {
    if(this.selectedIndex == index) {
      if(!this.editMode) {
        this.selectedIndex = null;
        this.selectedApartment = null;
      }

      return;
    }

    this.selectedIndex = index;
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[index]);
  }

  activateEditMode() { 
    if(this.selectedIndex == undefined || this.selectedIndex == null) return;

    this.selectedApartment = ApartmentSketch.clone(this.allApartments[this.selectedIndex]);
    this.editMode = true;
  }

  submitEdit() {
    this.editMode = false;
    
    this.allApartments[this.selectedIndex] = ApartmentSketchComponent.getCurrentAsInPixels();
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[this.selectedIndex]);
  }

  discardEdit() {
    this.editMode = false;
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[this.selectedIndex]);
  }

  showEditField(index): boolean {
    return this.editMode && this.selectedIndex == index;
  }

}
