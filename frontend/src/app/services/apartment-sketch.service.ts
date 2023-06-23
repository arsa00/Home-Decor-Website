import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApartmentSketch, ObjectType, RoomSketch } from '../models/ApartmentSketch';
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

  /*
      const apartmentSketchId = new mongoTypes.Types.ObjectId(sanitaze(req.body.apartmentSketchId));
      const roomSketches = sanitaze(req.body.roomSketches);
      const firstRoomScreenUsage = sanitaze(req.body.firstRoomScreenUsage);
      const type = sanitaze(req.body.type);
      const address = sanitaze(req.body.address);
      const squareFootage = sanitaze(req.body.squareFootage);
  
  */

  /*
  apartmentSketchRouter.route("/addApartmentSketch").post(
    (req, res) => new ApartmentSketchController().addApartmentSketch(req, res)
)


apartmentSketchRouter.route("/updateApartmentSketch").post(
    (req, res) => new ApartmentSketchController().updateApartmentSketch(req, res)
)


apartmentSketchRouter.route("/deleteApartmentSketch").post(
    (req, res) => new ApartmentSketchController().deleteApartmentSketch(req, res)
)


apartmentSketchRouter.route("/getAllOwnersApartmentSketches").post(
    (req, res) => new ApartmentSketchController().getAllOwnersApartmentSketches(req, res)
)
*/

}
