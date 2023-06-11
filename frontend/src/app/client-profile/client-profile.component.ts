import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {

  loggedUser: User;

  constructor() { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));
  }

}
