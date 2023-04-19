import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimeService {

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

  public meanDelayByTime(paramGraphElement: String, paramGraphElement2: String):Observable<any>{
    let urlApi=this.companieBaseUrl+'delay_option_by_year?option='+paramGraphElement+'&year='+paramGraphElement2
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }

  public meanDelayByHour(paramGraphYear:string):Observable<any>{
    let urlApi=this.companieBaseUrl+'calculate_delay_by_2hour?year='+paramGraphYear
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }

  public meanDelayDayMonth(paramGraphYear:string):Observable<any>{
    let urlApi=this.companieBaseUrl+'calculate_delay_by_2hour?year='+paramGraphYear
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }


}
