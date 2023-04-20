import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompaniesComponent} from "./pages/companies/companies.component";
import {AirportComponent} from "./pages/airport/airport.component";
import {TimesComponent} from "./pages/times/times.component";
import {CapacityComponent} from "./pages/capacity/capacity.component";
import {AcceuilComponent} from "./pages/acceuil/acceuil.component";



const routes: Routes = [
  {path:"Acceuil",component:AcceuilComponent },
  {path:"Companies",component:CompaniesComponent },
  {path:"Aéroport",component:AirportComponent },
  {path:"Temps",component: TimesComponent},
  {path:"Capacity",component: CapacityComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
