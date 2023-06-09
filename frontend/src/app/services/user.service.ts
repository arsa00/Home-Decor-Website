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
      username: username,
      password: password
    }

    return this.http.post(`${ GlobalConstants.URI }/user/login`, dataPayload);
  }

}
