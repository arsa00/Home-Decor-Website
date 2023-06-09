import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { Employee } from '../models/Employee';
import { AgencyRequest } from '../models/AgencyRequest';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  constructor(private http: HttpClient) { }

  getAgencies(searchTerm: string, searchName: boolean, searchAddress: boolean) {
    let httpParams = new HttpParams()
                      .append("searchTerm", searchTerm)
                      .append("searchName", searchName)
                      .append("searchAddress", searchAddress);

    return this.http.get(`${GlobalConstants.URI}/agency/getAgencies`, { params: httpParams });
  }


  getAgency(agencyID: string) {
    const httpParams = new HttpParams().append("agencyID", agencyID);

    return this.http.get(`${GlobalConstants.URI}/agency/getAgency`, { params: httpParams });
  }


  getAllComments(jwt: string, agencyID: string) {
    const httpParams = new HttpParams().append("jwt", jwt).append("agencyID", agencyID);

    return this.http.get(`${GlobalConstants.URI}/agency/getAllComments`, { params: httpParams });
  }


  getAllAnonymousComments(agencyID: string) {
    const httpParams = new HttpParams().append("agencyID", agencyID);

    return this.http.get(`${GlobalConstants.URI}/agency/getAllAnonymousComments`, { params: httpParams });
  }


  getCommentByJobId(jwt: string, jobId: string) {
    const httpParams = new HttpParams().append("jwt", jwt).append("jobId", jobId);

    return this.http.get(`${GlobalConstants.URI}/agency/getCommentByJobId`, { params: httpParams });
  }


  addComment(jwt: string, jobId: string, comment: string, grade: number, clientId: string) {
    const dataPayload = {
      "jwt": jwt,
      "jobId": jobId,
      "comment": comment,
      "grade": grade,
      "clientId": clientId
    }

    return this.http.post(`${GlobalConstants.URI}/agency/addComment`, dataPayload);
  }


  updateComment(jwt: string, commentId: string, clientUsername: string, comment?: string, grade?: number) {
    let dataPayload;

    dataPayload = {
      "jwt": jwt,
      "commentId": commentId,
      "clientUsername": clientUsername,
    }

    if(comment) dataPayload = { ...dataPayload, "comment": comment };
    if(grade) dataPayload = { ...dataPayload, "grade": grade };

    return this.http.post(`${GlobalConstants.URI}/agency/updateComment`, dataPayload);
  }


  addEmployee(jwt: string, agencyId: string, employee: Employee) {
    const dataPayload = {
      "jwt": jwt,
      "agencyId": agencyId,
      "employee": employee
    }

    return this.http.post(`${GlobalConstants.URI}/agency/addEmployee`, dataPayload);
  }


  updateEmployee(jwt: string, agencyId: string, employee: Employee) {
    const dataPayload = {
      "jwt": jwt,
      "agencyId": agencyId,
      "employee": employee
    }

    return this.http.post(`${GlobalConstants.URI}/agency/updateEmployee`, dataPayload);
  }


  deleteEmployee(jwt: string, agencyId: string, employeeId: string) {
    const dataPayload = {
      "jwt": jwt,
      "agencyId": agencyId,
      "employeeId": employeeId
    }

    return this.http.post(`${GlobalConstants.URI}/agency/deleteEmployee`, dataPayload);
  }


  getAllEmployeesForAgency(jwt: string, agencyId: string) {
    const dataPayload = {
      "jwt": jwt,
      "agencyId": agencyId
    }

    return this.http.post(`${GlobalConstants.URI}/agency/getAllEmployeesForAgency`, dataPayload);
  }


  getAllAvailableEmployeesForAgency(jwt: string, agencyId: string) {
    const dataPayload = {
      "jwt": jwt,
      "agencyId": agencyId
    }

    return this.http.post(`${GlobalConstants.URI}/agency/getAllAvailableEmployeesForAgency`, dataPayload);
  }


  getNumOfOpenedPositions(jwt: string, agencyId: string) {
    const dataPayload = {
      "jwt": jwt,
      "agencyId": agencyId
    }

    return this.http.post(`${GlobalConstants.URI}/agency/getNumOfOpenedPositions`, dataPayload);
  }


  addNewAgencyRequest(jwt: string, agencyReq: AgencyRequest) {
    const dataPayload = {
      "jwt": jwt,
      "agencyReq": agencyReq
    }

    return this.http.post(`${GlobalConstants.URI}/agency/addNewAgencyRequest`, dataPayload);
  }


  getAllAgencyRequestsByAgencyId(jwt: string, agencyId: string) {
    const dataPayload = {
      "jwt": jwt,
      "agencyId": agencyId
    }

    return this.http.post(`${GlobalConstants.URI}/agency/getAllAgencyRequestsByAgencyId`, dataPayload);
  }


  acceptAgencyRequest(jwt: string, agencyRequestId: string) {
    const dataPayload = {
      "jwt": jwt,
      "agencyRequestId": agencyRequestId
    }

    return this.http.post(`${GlobalConstants.URI}/agency/acceptAgencyRequest`, dataPayload);
  }


  rejectAgencyRequest(jwt: string, agencyRequestId: string) {
    const dataPayload = {
      "jwt": jwt,
      "agencyRequestId": agencyRequestId
    }

    return this.http.post(`${GlobalConstants.URI}/agency/rejectAgencyRequest`, dataPayload);
  }

}
