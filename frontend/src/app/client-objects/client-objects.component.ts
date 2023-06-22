import { Component, OnInit } from '@angular/core';
import { ApartmentSketch, ObjectType } from '../models/ApartmentSketch';

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
    this.selectedApartmen = ApartmentSketch.clone(this.allApartmens[index]);
    this.selectedIndex = index;
  }

  activateEditMode() { this.editMode = true; }

  submitEdit() {
    this.editMode = false;
  }

  discardEdit() {
    this.editMode = false;
  }

  showEditField(index): boolean {
    return this.editMode && this.selectedIndex == index;
  }

}
