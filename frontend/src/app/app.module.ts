import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApartmentSketchComponent } from './apartment-sketch/apartment-sketch.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';

import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { GuestPageComponent } from './guest-page/guest-page.component';


@NgModule({
  declarations: [
    AppComponent,
    ApartmentSketchComponent,
    LoginComponent,
    AdminLoginComponent,
    ClientProfileComponent,
    GuestPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
