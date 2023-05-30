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
import { CauseDelayComponent } from './pages/causes/cause-delay.component';
import { AcceuilComponent } from './pages/acceuil/acceuil.component';
import { PredictionComponent } from './pages/prediction/prediction.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    AirportComponent,
    TimesComponent,
    CapacityComponent,
    CompaniesComponent,
    CauseDelayComponent,
    AcceuilComponent,
    PredictionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
