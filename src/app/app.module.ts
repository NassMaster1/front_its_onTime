import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './sharesPages/navbar/navbar.component';
import { FooterComponent } from './sharesPages/footer/footer.component';
import { AirportComponent } from './pages/airport/airport.component';
import { TimesComponent } from './pages/times/times.component';
import { CapacityComponent } from './pages/capacity/capacity.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    AirportComponent,
    TimesComponent,
    CapacityComponent,
    CompaniesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
