import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApartmentSketchComponent } from './apartment-sketch/apartment-sketch.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { GuestPageComponent } from './guest-page/guest-page.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordRecoveryRequestComponent } from './password-recovery-request/password-recovery-request.component';
import { AgencyProfileComponent } from './agency-profile/agency-profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AgencySearchCardComponent } from './agency-search-card/agency-search-card.component';
import { AgencyDetailsComponent } from './agency-details/agency-details.component';
import { CommentComponent } from './comment/comment.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ClientObjectsComponent } from './client-objects/client-objects.component';
import { HireAgencyRequestComponent } from './hire-agency-request/hire-agency-request.component';
import { JobListComponent } from './job-list/job-list.component';
import { ClientJobDetailsComponent } from './client-job-details/client-job-details.component';
import { AgencyEmployeesComponent } from './agency-employees/agency-employees.component';
import { AgencyJobListComponent } from './agency-job-list/agency-job-list.component';


@NgModule({
  declarations: [
    AppComponent,
    ApartmentSketchComponent,
    LoginComponent,
    AdminLoginComponent,
    ClientProfileComponent,
    GuestPageComponent,
    RegisterComponent,
    ResetPasswordComponent,
    PasswordRecoveryRequestComponent,
    AgencyProfileComponent,
    AdminDashboardComponent,
    NavbarComponent,
    AgencySearchCardComponent,
    AgencyDetailsComponent,
    CommentComponent,
    ChangePasswordComponent,
    ClientObjectsComponent,
    HireAgencyRequestComponent,
    JobListComponent,
    ClientJobDetailsComponent,
    AgencyEmployeesComponent,
    AgencyJobListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
