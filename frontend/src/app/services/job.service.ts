import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { Job, JobState } from '../models/Job';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) { }

  addJob(jwt: string, job: Job) {
    const dataPayload = {
      "jwt": jwt,
      ...job
    }

    return this.http.post(`${GlobalConstants.URI}/job/addJob`, dataPayload);
  }


  updateJob(jwt: string, 
            jobID: string, 
            state?: JobState, 
            cancelRequested?: boolean, 
            agencyOffer?: number, 
            clientID?: string, 
            agencyID?: string, 
            objectID?: string, 
            startDate?: Date, 
            endDate?: Date) {
    let dataPayload;

    dataPayload = { "jwt": jwt, "jobID": jobID };

    if(state) dataPayload = { ...dataPayload, "state": state };
    if(cancelRequested) dataPayload = { ...dataPayload, "cancelRequested": cancelRequested };
    if(agencyOffer) dataPayload = { ...dataPayload, "agencyOffer": agencyOffer };
    if(clientID) dataPayload = { ...dataPayload, "clientID": clientID };
    if(agencyID) dataPayload = { ...dataPayload, "agencyID": agencyID };
    if(objectID) dataPayload = { ...dataPayload, "objectID": objectID };
    if(startDate) dataPayload = { ...dataPayload, "startDate": startDate };
    if(endDate) dataPayload = { ...dataPayload, "endDate": endDate };

    return this.http.post(`${GlobalConstants.URI}/job/updateJob`, dataPayload);
  }

}
