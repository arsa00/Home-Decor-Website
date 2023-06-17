import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  @Input() activeNav: string = "guest";
  @Input() activePage: number = 0; // looking from left to right

  constructor() { }

  ngOnInit(): void {
  }

  isGuestNav(): boolean {
    return this.activeNav === GlobalConstants.NONE_TYPE;
  }

  isClientNav(): boolean {
    return this.activeNav === GlobalConstants.CLIENT_TYPE;
  }

}
