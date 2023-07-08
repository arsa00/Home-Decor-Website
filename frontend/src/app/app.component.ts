import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from './global-constants';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'Home Decor';

  ngOnInit(): void {
    const jwtHelper = new JwtHelperService();
    let user: User;
    let admin: User;

    try {
      admin =  JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_ADMIN));
      user = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));
    } catch(err) {
      return;
    }
    
    if(user && jwtHelper.isTokenExpired(user.jwt)) {
      localStorage.removeItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER);
    }

    if(admin && jwtHelper.isTokenExpired(admin.jwt)) {
      localStorage.removeItem(GlobalConstants.LOCAL_STORAGE_LOGGED_ADMIN);
    }

  }
}
