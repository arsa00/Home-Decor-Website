import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { GuestPageComponent } from './guest-page/guest-page.component';
import { RegisterComponent } from './register/register.component';
import { PasswordRecoveryRequestComponent } from './password-recovery-request/password-recovery-request.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AlreadyLoggedGuard } from './guards/already-logged';
import { LoginRequiredGuard } from './guards/login-required';
import { AgencyDetailsComponent } from './agency-details/agency-details.component';
import { ClientObjectsComponent } from './client-objects/client-objects.component';
import { GlobalConstants } from './global-constants';
import { LoggedAsClientGuard } from './guards/logged-as-client';
import { AgencyProfileComponent } from './agency-profile/agency-profile.component';
import { LoggedAsAgencyGuard } from './guards/logged-as-agency';
import { HireAgencyRequestComponent } from './hire-agency-request/hire-agency-request.component';

const routes: Routes = [
  { path: GlobalConstants.ROUTE_LOGIN, component: LoginComponent, canActivate: [AlreadyLoggedGuard] },
  { path: GlobalConstants.ROUTE_ADMIN_LOGIN, component: AdminLoginComponent, canActivate: [AlreadyLoggedGuard] },
  { path: GlobalConstants.ROUTE_REGISTER, component: RegisterComponent, canActivate: [AlreadyLoggedGuard] },
  { path: GlobalConstants.ROUTE_REQ_PASS_RESET, component: PasswordRecoveryRequestComponent, canActivate: [AlreadyLoggedGuard] },
  { path: `${GlobalConstants.ROUTE_PASS_RESET}/:recoveryLink`, component: ResetPasswordComponent },
  { path: GlobalConstants.ROUTE_GUEST_PAGE, component: GuestPageComponent },
  { path: `${GlobalConstants.ROUTE_GUEST_AGENCY_DETAILS}/:agencyID`, component: AgencyDetailsComponent },

  { path: GlobalConstants.ROUTE_CLIENT_PROFILE, component: ClientProfileComponent, canActivate: [LoggedAsClientGuard] },
  { path: GlobalConstants.ROUTE_CLIENT_OBJECTS, component: ClientObjectsComponent, canActivate: [LoggedAsClientGuard] },
  { path: GlobalConstants.ROUTE_CLIENT_AGENCIES_SEARCH, component: GuestPageComponent, canActivate: [LoggedAsClientGuard] },
  { path: `${GlobalConstants.ROUTE_CLIENT_HIRE_AGENCY_REQ}/:agencyID`, component: HireAgencyRequestComponent },

  { path: GlobalConstants.ROUTE_AGENCY_PROFILE, component: AgencyProfileComponent, canActivate: [LoggedAsAgencyGuard] },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
