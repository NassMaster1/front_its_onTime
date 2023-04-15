import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AirportService {

  private readonly airportBaseUrl = `${environment.baseUrl}`

  constructor(private httpClient: HttpClient ) { }

  public getAllAirport(): Observable<Object>{
    return this.httpClient.get(this.airportBaseUrl+'airport_list')
  }

}

