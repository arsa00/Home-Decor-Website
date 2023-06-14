import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    const dataPayload = {
      "username": username,
      "password": password
    }

    return this.http.post(`${ GlobalConstants.URI }/user/login`, dataPayload);
  }

  registerClient(username: string, password: string, phone: string, mail: string, firstname: string, lastname: string) { 
    const dataPayload = {
      "username": username,
      "password": password,
      "type": GlobalConstants.CLIENT_TYPE,
      "phone": phone,
      "mail": mail,
      "firstname": firstname,
      "lastname": lastname
    };

    return this.http.post(`${ GlobalConstants.URI }/user/register`, dataPayload);
  }

  registerAgency(username: string, password: string, phone: string, mail: string, name: string, address: string, idNumber: string, description: string) {
    const dataPayload = {
      "username": username,
      "password": password,
      "type": GlobalConstants.AGENCY_TYPE,
      "phone": phone,
      "mail": mail,
      "name": name,
      "address": address,
      "idNumber": idNumber,
      "description": description
    }

    return this.http.post(`${ GlobalConstants.URI }/user/register`, dataPayload);
  }

  uploadProfileImage(username: string, image: File) {
    const formData = new FormData();

    formData.append("profileImg", image);
    formData.append("username", username);

    return this.http.post(`${ GlobalConstants.URI }/user/uploadProfileImg`, formData);
  }

}
