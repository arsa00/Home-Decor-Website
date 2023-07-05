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
            cancelReqMsg?: string, 
            agencyOffer?: number, 
            clientID?: string, 
            agencyID?: string,
            agencyName?: string, 
            objectID?: string, 
            objectType?: string, 
            objectAddress?: string, 
            startDate?: Date, 
            endDate?: Date) {
    let dataPayload;

    dataPayload = { "jwt": jwt, "jobID": jobID };

    if(state) dataPayload = { ...dataPayload, "state": state };
    if(cancelRequested) dataPayload = { ...dataPayload, "cancelRequested": cancelRequested };
    if(cancelReqMsg) dataPayload = { ...dataPayload, "cancelReqMsg": cancelReqMsg };
    if(agencyOffer) dataPayload = { ...dataPayload, "agencyOffer": agencyOffer };
    if(clientID) dataPayload = { ...dataPayload, "clientID": clientID };
    if(agencyID) dataPayload = { ...dataPayload, "agencyID": agencyID };
    if(agencyName) dataPayload = { ...dataPayload, "agencyName": agencyName };
    if(objectID) dataPayload = { ...dataPayload, "objectID": objectID };
    if(objectType) dataPayload = { ...dataPayload, "objectType": objectType };
    if(objectAddress) dataPayload = { ...dataPayload, "objectAddress": objectAddress };
    if(startDate) dataPayload = { ...dataPayload, "startDate": startDate };
    if(endDate) dataPayload = { ...dataPayload, "endDate": endDate };

    return this.http.post(`${GlobalConstants.URI}/job/updateJob`, dataPayload);
  }


  getAllClientJobs(jwt: string, clientID: string) {
    const dataPayload = {
      "jwt": jwt,
      "clientID": clientID
    }

    return this.http.post(`${GlobalConstants.URI}/job/getAllClientJobs`, dataPayload);
  }


  getJobByID(jwt: string, jobID: string) {
    const dataPayload = {
      "jwt": jwt,
      "jobID": jobID
    }

    return this.http.post(`${GlobalConstants.URI}/job/getJobByID`, dataPayload);
  }


  deleteJob(jwt: string, jobID: string) {
    const dataPayload = {
      "jwt": jwt,
      "jobID": jobID
    }

    return this.http.post(`${GlobalConstants.URI}/job/deleteJob`, dataPayload);
  }
}
