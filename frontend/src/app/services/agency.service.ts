import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../global-constants';

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
}
