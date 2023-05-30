import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompaniesComponent} from "./pages/companies/companies.component";
import {AirportComponent} from "./pages/airport/airport.component";
import {TimesComponent} from "./pages/times/times.component";
import {CapacityComponent} from "./pages/capacity/capacity.component";
import { CauseDelayComponent } from './pages/causes/cause-delay.component';
import {AcceuilComponent} from "./pages/acceuil/acceuil.component";
import {PredictionComponent} from "./pages/prediction/prediction.component";


const routes: Routes = [
  {path:"Acceuil",component:AcceuilComponent },
  {path:"Companies",component:CompaniesComponent },
  {path:"Aéroport",component:AirportComponent },
  {path:"Temps",component: TimesComponent},
  {path:"Capacity",component: CapacityComponent},
  {path:"Causes",component: CauseDelayComponent},
  {path:"Prediction",component: PredictionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
