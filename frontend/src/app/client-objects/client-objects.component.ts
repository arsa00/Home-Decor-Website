import { Component, OnInit } from '@angular/core';
import { ApartmentSketch, ObjectType } from '../models/ApartmentSketch';
import { ApartmentSketchComponent } from '../apartment-sketch/apartment-sketch.component';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { ViewportScroller } from '@angular/common';
import { ApartmentSketchService } from '../services/apartment-sketch.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-client-objects',
  templateUrl: './client-objects.component.html',
  styleUrls: ['./client-objects.component.css']
})
export class ClientObjectsComponent implements OnInit {

  loggedUser: User;

  allApartments: ApartmentSketch[] = [];
  selectedIndex: number;
  selectedApartment: ApartmentSketch;

  editMode: boolean = false;

  addNewObjectMode: boolean = false;
  continueAddingObject: boolean = false;
  newObjectType: ObjectType;
  newObjectAddress: string;
  newObjectSquareFootage: number;

  
  newObjectTypeErr: boolean = false;
  newObjectAddressErr: boolean = false;
  newObjectSquareFootageErr: boolean = false;

  constructor(private scroller: ViewportScroller, private apartmentSketchService: ApartmentSketchService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    this.apartmentSketchService.getAllOwnersApartmentSketches(this.loggedUser.jwt, this.loggedUser._id).subscribe({
      next: (allApartmentSketches: ApartmentSketch[]) => {
        this.allApartments = allApartmentSketches;
        console.log(allApartmentSketches);
      },
      error: () => { new bootstrap.Toast(document.getElementById("err")).show(); }
    });
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
    
    const editedAS = ApartmentSketchComponent.getCurrentAsInMeters();
    // console.log(editedAS);

    // delete all unset rooms (overlapping ones)
    let firstRoomWidthInMeters: number;
    let cnt: number = 0;
    while(cnt < editedAS.roomSketches.length) {
      if(!editedAS.roomSketches[cnt].isSet) {

        if(cnt == 0) {
          firstRoomWidthInMeters = editedAS.roomSketches[0].projectWidth;
        }

        editedAS.roomSketches.splice(cnt, 1);

      } else {
        cnt++;
      }
    }

    if(firstRoomWidthInMeters) 
      ApartmentSketchComponent.recalculateFirstRoomScreenUsage(firstRoomWidthInMeters, editedAS);

    // potentionally here it could be checked what exactly was changed & to update only that fields, not whole object
    this.apartmentSketchService
        .updateApartmentSketch(this.loggedUser.jwt, editedAS._id, editedAS.roomSketches, 
                              editedAS.firstRoomScreenUsage, editedAS.type, editedAS.address, editedAS.squareFootage)
        .subscribe({
          next: (apartmentSketchDb: ApartmentSketch) => {
            this.allApartments[this.selectedIndex] = apartmentSketchDb;
            this.selectedApartment = ApartmentSketch.clone(this.allApartments[this.selectedIndex]);
          },
          error: () => { new bootstrap.Toast(document.getElementById("err")).show(); }
        });

    
  }

  discardEdit() {
    this.editMode = false;
    this.selectedApartment = ApartmentSketch.clone(this.allApartments[this.selectedIndex]);
  }

  showEditField(index): boolean {
    return this.editMode && this.selectedIndex == index;
  }


  showAddNewobject() {
    this.addNewObjectMode = true;
  }

  hideAddNewobject() {
    this.addNewObjectMode = false;
    this.continueAddingObject = false;
  }

  hideContinueAddingAndScroll() {
    this.continueAddingObject = false;
    this.scroller.scrollToAnchor("apartmentSketchCanvas");
  }

  addNewObject() {
    this.newObjectTypeErr = false;
    this.newObjectAddressErr = false;
    this.newObjectSquareFootageErr = false;

    let isErrCatched: boolean = false;

    if(!this.newObjectType) {
      this.newObjectTypeErr = true;
      isErrCatched = true;
    }

    if(!this.newObjectAddress) {
      this.newObjectAddressErr = true;
      isErrCatched = true;
    }

    this.newObjectSquareFootage = Number.parseInt(`${this.newObjectSquareFootage}`);

    if(!this.newObjectSquareFootage || typeof this.newObjectSquareFootage != "number" || this.newObjectSquareFootage < 0) {
			this.newObjectSquareFootageErr = true;
			isErrCatched = true;
      this.newObjectSquareFootage = undefined;
		}


    if(isErrCatched) return;

    // insert to db; fetch from db; append allApartments list;
    const newAS = new ApartmentSketch(0.5, this.newObjectType, this.newObjectAddress, this.newObjectSquareFootage, this.loggedUser._id);
    this.apartmentSketchService.addApartmentSketch(this.loggedUser.jwt, newAS).subscribe({
      next: (apartmentSketchDb: ApartmentSketch) => {
        this.allApartments.push(apartmentSketchDb);
        this.selectedIndex = this.allApartments.length - 1;
        this.activateEditMode();
        this.addNewObjectMode = false;
        this.continueAddingObject = true;
      },
      error: () => { 
        new bootstrap.Toast(document.getElementById("err")).show(); 
        this.addNewObjectMode = false;
      }
    });

    // console.log(this.selectedApartment)
  }
}
