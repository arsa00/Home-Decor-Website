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
import { JobListComponent } from './job-list/job-list.component';
import { ClientJobDetailsComponent } from './client-job-details/client-job-details.component';
import { AgencyEmployeesComponent } from './agency-employees/agency-employees.component';
import { AgencyJobListComponent } from './agency-job-list/agency-job-list.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoggedAsAdminGuard } from './guards/logged-as-admin';
import { AdminUserListComponent } from './admin-user-list/admin-user-list.component';
import { AdminAgencyEmployeesComponent } from './admin-agency-employees/admin-agency-employees.component';
import { AdminJobListComponent } from './admin-job-list/admin-job-list.component';

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
  { path: `${GlobalConstants.ROUTE_CLIENT_HIRE_AGENCY_REQ}/:agencyID/:agencyName`, component: HireAgencyRequestComponent, canActivate: [LoggedAsClientGuard] },
  { path: GlobalConstants.ROUTE_CLIENT_JOBS_LIST, component: JobListComponent, canActivate: [LoggedAsClientGuard] },
  { path: `${GlobalConstants.ROUTE_CLIENT_JOB_DETAILS}/:jobID`, component: ClientJobDetailsComponent, canActivate: [LoggedAsClientGuard] },

  { path: GlobalConstants.ROUTE_AGENCY_PROFILE, component: AgencyProfileComponent, canActivate: [LoggedAsAgencyGuard] },
  { path: GlobalConstants.ROUTE_AGENCY_EMPLOYEES, component: AgencyEmployeesComponent, canActivate: [LoggedAsAgencyGuard] },
  { path: GlobalConstants.ROUTE_AGENCY_JOB_LIST, component: AgencyJobListComponent, canActivate: [LoggedAsAgencyGuard] },

  { path: GlobalConstants.ROUTE_ADMIN_DASHBOARD, component: AdminDashboardComponent, canActivate: [LoggedAsAdminGuard] },  
  { path: GlobalConstants.ROUTE_ADMIN_USER_LIST, component: AdminUserListComponent, canActivate: [LoggedAsAdminGuard] }, 
  { path: GlobalConstants.ROUTE_ADMIN_ADD_USER, component: RegisterComponent, canActivate: [LoggedAsAdminGuard] }, 
  { path: GlobalConstants.ROUTE_ADMIN_AGENCY_EMPLOYEES, component: AdminAgencyEmployeesComponent, canActivate: [LoggedAsAdminGuard] },
  { path: GlobalConstants.ROUTE_ADMIN_JOB_LIST, component: AdminJobListComponent, canActivate: [LoggedAsAdminGuard] },    
  { path: `${GlobalConstants.ROUTE_ADMIN_JOB_DETAILS}/:jobID`, component: ClientJobDetailsComponent, canActivate: [LoggedAsAdminGuard] },   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
