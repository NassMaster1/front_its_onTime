import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompaniesComponent} from "./pages/companies/companies.component";
import {AirportComponent} from "./pages/airport/airport.component";
import {TimesComponent} from "./pages/times/times.component";
import {CapacityComponent} from "./pages/capacity/capacity.component";



const routes: Routes = [
  {path:"Companies",component:CompaniesComponent },
  {path:"airport",component:AirportComponent },
  {path:"Times",component: TimesComponent},
  {path:"Capacity",component: CapacityComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
