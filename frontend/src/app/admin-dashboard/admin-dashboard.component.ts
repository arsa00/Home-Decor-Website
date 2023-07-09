import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../global-constants';
import { User } from '../models/User';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  loggedAdmin: User;
  changePassMode: boolean = false;

  constructor(private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.loggedAdmin = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_ADMIN));
  }

  redirectToUserListPage() {
    this.router.navigate([GlobalConstants.ROUTE_ADMIN_USER_LIST]);
  }

  redirectToJobListPage() {
    this.router.navigate([GlobalConstants.ROUTE_ADMIN_JOB_LIST]);
  }

  logout() {
    this.userService.logout();
    this.router.navigate([GlobalConstants.ROUTE_LOGIN]);
  }

  openChangePassDialog(): void {
    this.changePassMode = true;
  }

  closeChangePassDialog = () => {
    this.changePassMode = false;
  }

  passChangeSucc = () => {
    new bootstrap.Toast(document.getElementById("passResetSucc")).show();
  }

}
