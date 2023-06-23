import { Component, OnInit } from '@angular/core';
import { ApartmentSketch, ObjectType } from '../models/ApartmentSketch';
import { ApartmentSketchComponent } from '../apartment-sketch/apartment-sketch.component';

@Component({
  selector: 'app-client-objects',
  templateUrl: './client-objects.component.html',
  styleUrls: ['./client-objects.component.css']
})
export class ClientObjectsComponent implements OnInit {

  allApartmens: ApartmentSketch[] = [];
  selectedIndex: number;
  selectedApartmen: ApartmentSketch;

  editMode: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.allApartmens.push(new ApartmentSketch(0.5, ObjectType.APARTMENT, "Adresa stana 1/2, Beograd 11000", 52));
    this.allApartmens.push(new ApartmentSketch(0.5, ObjectType.HOUSE, "Adresa stana 2/2, Beograd 11000", 92));
  }

  setActive(index): void {
    if(this.selectedIndex == index) {
      if(!this.editMode) {
        this.selectedIndex = null;
        this.selectedApartmen = null;
      }

      return;
    }

    this.selectedIndex = index;
    this.selectedApartmen = ApartmentSketch.clone(this.allApartmens[index]);
  }

  activateEditMode() { 
    if(this.selectedIndex == undefined || this.selectedIndex == null) return;

    this.selectedApartmen = ApartmentSketch.clone(this.allApartmens[this.selectedIndex]);
    this.editMode = true;
  }

  submitEdit() {
    this.editMode = false;
    
    this.allApartmens[this.selectedIndex] = ApartmentSketchComponent.getCurrentAsInPixels();
    console.log("received", this.allApartmens[this.selectedIndex]);
    this.selectedApartmen = ApartmentSketch.clone(this.allApartmens[this.selectedIndex]);
    
  }

  discardEdit() {
    this.editMode = false;
    this.selectedApartmen = ApartmentSketch.clone(this.allApartmens[this.selectedIndex]);
  }

  showEditField(index): boolean {
    return this.editMode && this.selectedIndex == index;
  }

}
