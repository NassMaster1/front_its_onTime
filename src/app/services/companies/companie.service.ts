import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompanieService {

  private readonly companieBaseUrl = `${environment.baseUrl}`

  constructor(private httpClient: HttpClient ) { }

  getListCodeCompanies():Observable<any>{
    let urlApi=this.companieBaseUrl+'list_code_companies'
    return this.httpClient.get(urlApi)
  }

  getListStates():Observable<any>{
    let urlApi=this.companieBaseUrl+'list_state'
    return this.httpClient.get(urlApi)
  }

  getListCity():Observable<any> {
    let urlApi=this.companieBaseUrl+'list_city'
    return this.httpClient.get(urlApi)
  }

  public meanDelayCompanies(paramGraphElement: String, paramGraphElement2: String):Observable<any>{
    let urlApi=this.companieBaseUrl+'companie_delay_trend?companie_code='+paramGraphElement+'&year='+paramGraphElement2
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }

  public CancelledCompanies(paramGraphElement: String, paramGraphElement2: String):Observable<any>{
    let urlApi=this.companieBaseUrl+'companie_cancelled?companie_code='+paramGraphElement+'&year='+paramGraphElement2
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }

  public delayStates(paramGraphOrigin: String, paramGraphDest: String,paramGraphYear:string):Observable<any>{
    let urlApi=this.companieBaseUrl+'state_delay_trend?state_origin_name='+paramGraphOrigin+'&state_dest_name='+paramGraphDest+'&year='+paramGraphYear
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }

  public delayCity(paramGraphOrigin: String, paramGraphDest: String,paramGraphYear:string):Observable<any>{
    let urlApi=this.companieBaseUrl+'city_delay_trend?originCityName='+paramGraphOrigin+'&destCityName='+paramGraphDest+'&year='+paramGraphYear
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }

}
