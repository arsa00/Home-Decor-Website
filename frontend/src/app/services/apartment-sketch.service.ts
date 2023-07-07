import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApartmentSketch, ObjectType, ProgressState, RoomSketch } from '../models/ApartmentSketch';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class ApartmentSketchService {

  constructor(private http: HttpClient) { }

  addApartmentSketch(jwt: string, apartmentSketch: ApartmentSketch) {
    let dataPayload = {
      "jwt": jwt,
      ...apartmentSketch
    };

    return this.http.post(`${ GlobalConstants.URI }/apartmentSketch/addApartmentSketch`, dataPayload);
  }


  deleteApartmentSketch(jwt: string, apartmentSketchId: string) {
    let dataPayload = {
      "jwt": jwt,
      "apartmentSketchId": apartmentSketchId 
    };

    return this.http.post(`${ GlobalConstants.URI }/apartmentSketch/deleteApartmentSketch`, dataPayload);
  }


  getAllOwnersApartmentSketches(jwt: string, ownerId: string) {
    let dataPayload = {
      "jwt": jwt,
      "ownerId": ownerId 
    };

    return this.http.post(`${ GlobalConstants.URI }/apartmentSketch/getAllOwnersApartmentSketches`, dataPayload);
  }


  updateApartmentSketch(jwt: string, 
                        apartmentSketchId: string, 
                        roomSketches?: RoomSketch[], 
                        firstRoomScreenUsage?: number, 
                        type?: ObjectType, 
                        address?: string, 
                        squareFootage?: number
                      ) {
    let dataPayload;

    dataPayload = { 
      ...dataPayload, 
      "jwt": jwt,
      "apartmentSketchId": apartmentSketchId  
    };

    if(roomSketches) {
      dataPayload = { ...dataPayload, "roomSketches": roomSketches };
    }

    if(firstRoomScreenUsage != undefined && firstRoomScreenUsage != null) {
      dataPayload = { ...dataPayload, "firstRoomScreenUsage": firstRoomScreenUsage };
    }

    if(type) {
      dataPayload = { ...dataPayload, "type": type };
    }

    if(address) {
      dataPayload = { ...dataPayload, "address": address };
    }

    if(squareFootage != undefined && squareFootage != null) {
      dataPayload = { ...dataPayload, "squareFootage": squareFootage };
    }
    
    return this.http.post(`${ GlobalConstants.URI }/apartmentSketch/updateApartmentSketch`, dataPayload);
  }


  getApartmentSketchByID(jwt: string, apartmentSketchID: string) {
    let dataPayload = {
      "jwt": jwt,
      "apartmentSketchID": apartmentSketchID 
    };

    return this.http.post(`${ GlobalConstants.URI }/apartmentSketch/getApartmentSketchByID`, dataPayload);
  }


  getMultipleApartmentSketchesByIds(jwt: string, apartmentSketchIds: string[]) {
    let dataPayload = {
      "jwt": jwt,
      "apartmentSketchIds": apartmentSketchIds 
    };

    return this.http.post(`${ GlobalConstants.URI }/apartmentSketch/getMultipleApartmentSketchesByIds`, dataPayload);
  }


  updateRoomSketchProgress(jwt: string, apartmentSketchId: string, roomSketchIndex: number, progress: ProgressState) {
    let dataPayload = {
      "jwt": jwt,
      "apartmentSketchId": apartmentSketchId,
      "roomSketchIndex": roomSketchIndex,
      "progress": progress
    };

    return this.http.post(`${ GlobalConstants.URI }/apartmentSketch/updateRoomSketchProgress`, dataPayload);
  }
}
