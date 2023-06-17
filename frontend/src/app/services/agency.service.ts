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

}
