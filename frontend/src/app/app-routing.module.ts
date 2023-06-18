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

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [AlreadyLoggedGuard] },
  { path: "adminLogin", component: AdminLoginComponent, canActivate: [AlreadyLoggedGuard] },
  { path: "register", component: RegisterComponent, canActivate: [AlreadyLoggedGuard] },
  { path: "requestPasswordReset", component: PasswordRecoveryRequestComponent, canActivate: [AlreadyLoggedGuard] },
  { path: "resetPassword/:recoveryLink", component: ResetPasswordComponent },
  { path: "clientProfile", component: ClientProfileComponent, canActivate: [LoginRequiredGuard] },
  { path: "guestPage", component: GuestPageComponent },
  { path: "agencyDetails/:agencyID", component: AgencyDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
