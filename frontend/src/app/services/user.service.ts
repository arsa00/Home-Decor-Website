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


  logout() {
    localStorage.removeItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER);
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


  resetPassword(recoveryLink: string, password?: string) {
    let dataPayload;

    if(password) {
      dataPayload = {
        "recoveryLink": recoveryLink,
        "password": password
      }
    } else {
      dataPayload = {
        "recoveryLink": recoveryLink
      }
    }

    return this.http.post(`${ GlobalConstants.URI }/user/resetPassword`, dataPayload);
  }


  requestPasswordReset(mail: string) {
    const dataPayload = {
      "mail": mail
    }

    return this.http.post(`${ GlobalConstants.URI }/user/generateRecoveryLink`, dataPayload);
  }


  updateClientData(username: string, jwt: string, phone?: string, mail?: string, firstname?: string, lastname?: string) {
    let dataPayload;

    dataPayload  = {"username": username, "jwt": jwt };

    if(phone) {
      dataPayload = {
        ...dataPayload,
        "phone": phone
      }
    }

    if(mail) {
      dataPayload = {
        ...dataPayload,
        "mail": mail
      }
    }

    if(firstname) {
      dataPayload = {
        ...dataPayload,
        "firstname": firstname
      }
    }

    if(lastname) {
      dataPayload = {
        ...dataPayload,
        "lastname": lastname
      }
    }

    return this.http.post(`${ GlobalConstants.URI }/user/updateData`, dataPayload);
  }


  updateAgencyData(username: string, jwt: string, phone?: string, mail?: string, name?: string, address?: string, description?: string) {
    let dataPayload;

    dataPayload  = {"username": username, "jwt": jwt };

    if(phone) {
      dataPayload = {
        ...dataPayload,
        "phone": phone
      }
    }

    if(mail) {
      dataPayload = {
        ...dataPayload,
        "mail": mail
      }
    }

    if(name) {
      dataPayload = {
        ...dataPayload,
        "name": name
      }
    }

    if(address) {
      dataPayload = {
        ...dataPayload,
        "address": address
      }
    }

    if(description) {
      dataPayload = {
        ...dataPayload,
        "description": description
      }
    }

    return this.http.post(`${ GlobalConstants.URI }/user/updateData`, dataPayload);
  }


  changePassword(username: string, jwt: string, oldPassword: string, newPassword: string) {
    const dataPayload = {
      "username": username,
      "jwt": jwt,
      "oldPassword": oldPassword,
      "newPassword": newPassword
    }

    return this.http.post(`${ GlobalConstants.URI }/user/changePassword`, dataPayload);
  }
}
