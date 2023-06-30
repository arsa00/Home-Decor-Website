import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { GlobalConstants } from "../global-constants";
import { User } from "../models/User";

@Injectable({
    providedIn: 'root'
})
export class LoggedAsClientGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        try {
            const loggedUser: User = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

            if(loggedUser.type == GlobalConstants.CLIENT_TYPE) return true;

            switch(loggedUser.type) {
                case GlobalConstants.AGENCY_TYPE: return this.router.parseUrl(GlobalConstants.ROUTE_AGENCY_PROFILE);
                case GlobalConstants.ADMIN_TYPE: return this.router.parseUrl(GlobalConstants.ROUTE_ADMIN_DASHBOARD);
                default: return false;
            }
        } catch(err) {
            // corrupted data in locale storage
            localStorage.removeItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER);
            return this.router.parseUrl(GlobalConstants.ROUTE_LOGIN);
        }
    }

}