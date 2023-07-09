import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { Job, JobState } from '../models/Job';
import { Employee } from '../models/Employee';

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
            assignedEmployees?: Employee[],  
            clientID?: string, 
            agencyID?: string,
            agencyName?: string, 
            objectID?: string, 
            objectType?: string, 
            objectAddress?: string, 
            startDate?: Date, 
            endDate?: Date,
            clientFirstname?: string,
            clientLastname?: string,
            clientPhone?: string,
            clientMail?: string) {
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
    if(assignedEmployees) dataPayload = { ...dataPayload, "assignedEmployees": assignedEmployees };
    if(clientFirstname) dataPayload = { ...dataPayload, "clientFirstname": clientFirstname };
    if(clientLastname) dataPayload = { ...dataPayload, "clientLastname": clientLastname };
    if(clientPhone) dataPayload = { ...dataPayload, "clientPhone": clientPhone };
    if(clientMail) dataPayload = { ...dataPayload, "clientMail": clientMail };

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


  getAgencyJobsWithState(jwt: string, agencyId: string, jobState: JobState) {
    const dataPayload = {
      "jwt": jwt,
      "agencyId": agencyId,
      "jobState": jobState
    }

    return this.http.post(`${GlobalConstants.URI}/job/getAgencyJobsWithState`, dataPayload);
  }


  assignEmployeesToJob(jwt: string, agencyId: string, jobId: string, employees: Employee[]) {
    const dataPayload = {
      "jwt": jwt,
      "agencyId": agencyId,
      "jobId": jobId,
      "employees": employees
    }

    return this.http.post(`${GlobalConstants.URI}/job/assignEmployeesToJob`, dataPayload);
  }


  getNumberOfJobs(jwt: string) {
    const dataPayload = {
      "jwt": jwt
    }

    return this.http.post(`${GlobalConstants.URI}/job/getNumberOfJobs`, dataPayload);
  }


  getNumberOfJobCancelRequests(jwt: string) {
    const dataPayload = {
      "jwt": jwt
    }

    return this.http.post(`${GlobalConstants.URI}/job/getNumberOfJobCancelRequests`, dataPayload);
  }


  getSliceOfJobs(jwt: string, offset: number, limit: number) {
    const dataPayload = {
      "jwt": jwt,
      "offset": offset,
      "limit": limit
    }

    return this.http.post(`${GlobalConstants.URI}/job/getSliceOfJobs`, dataPayload);
  }


  getSliceOfJobCancelRequests(jwt: string, offset: number, limit: number) {
    const dataPayload = {
      "jwt": jwt,
      "offset": offset,
      "limit": limit
    }

    return this.http.post(`${GlobalConstants.URI}/job/getSliceOfJobCancelRequests`, dataPayload);
  }


  acceptJobCancelRequest(jwt: string, jobId: string) {
    const dataPayload = {
      "jwt": jwt,
      "jobId": jobId
    }

    return this.http.post(`${GlobalConstants.URI}/job/acceptJobCancelRequest`, dataPayload);
  }


  rejectJobCancelRequest(jwt: string, jobId: string) {
    const dataPayload = {
      "jwt": jwt,
      "jobId": jobId
    }

    return this.http.post(`${GlobalConstants.URI}/job/rejectJobCancelRequest`, dataPayload);
  }


  receiveRejectedJobCancelRequest(jwt: string, jobId: string) {
    const dataPayload = {
      "jwt": jwt,
      "jobId": jobId
    }

    return this.http.post(`${GlobalConstants.URI}/job/receiveRejectedJobCancelRequest`, dataPayload);
  }
}
