import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // needed copy of routes, because angular binding can't work with static values
  readonly ROUTE_LOGIN                  = GlobalConstants.ROUTE_LOGIN;         
  readonly ROUTE_ADMIN_LOGIN            = GlobalConstants.ROUTE_ADMIN_LOGIN;   
  readonly ROUTE_REGISTER               = GlobalConstants.ROUTE_REGISTER;     
  readonly ROUTE_REQ_PASS_RESET         = GlobalConstants.ROUTE_REQ_PASS_RESET;
  readonly ROUTE_PASS_RESET             = GlobalConstants.ROUTE_PASS_RESET;
  readonly ROUTE_GUEST_PAGE             = GlobalConstants.ROUTE_GUEST_PAGE;   
  readonly ROUTE_GUEST_AGENCIES         = GlobalConstants.ROUTE_GUEST_AGENCIES;
  readonly ROUTE_CLIENT_PROFILE         = GlobalConstants.ROUTE_CLIENT_PROFILE;
  readonly ROUTE_CLIENT_OBJECTS         = GlobalConstants.ROUTE_CLIENT_OBJECTS;
  readonly ROUTE_CLIENT_AGENCIES_SEARCH = GlobalConstants.ROUTE_CLIENT_AGENCIES_SEARCH;

  @Input() activeNav: string = "guest";

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  isGuestNav(): boolean {
    return this.activeNav === GlobalConstants.NONE_TYPE;
  }

  isClientNav(): boolean {
    return this.activeNav === GlobalConstants.CLIENT_TYPE;
  }

  isActiveLink(activeLink: string): boolean {
    return `/${activeLink}` === this.router.url;
  }

  logout() {
    this.userService.logout();
  }

}
