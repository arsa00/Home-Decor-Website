import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { GuestPageComponent } from './guest-page/guest-page.component';
import { RegisterComponent } from './register/register.component';
import { PasswordRecoveryRequestComponent } from './password-recovery-request/password-recovery-request.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "adminLogin", component: AdminLoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "requestPasswordReset", component: PasswordRecoveryRequestComponent },
  { path: "resetPassword/:recoveryLink", component: ResetPasswordComponent },
  { path: "clientProfile", component: ClientProfileComponent },
  { path: "guestPage", component: GuestPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
