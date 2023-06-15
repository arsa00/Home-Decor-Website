import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { User } from '../models/User';

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

    formData.append("username", username);
    formData.append("profileImg", image);
    
    return this.http.post(`${ GlobalConstants.URI }/user/uploadProfileImg`, formData);
  }

  refreshLoggedUser(newData: User) { // TODO: test this
    // if user is logged, refresh saved data
    if(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER)) {
      newData.jwt = (JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER))).jwt; // preserve jwt
      localStorage.setItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER, JSON.stringify(newData)); // update logged user
    }
  }

}
