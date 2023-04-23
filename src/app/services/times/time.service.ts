import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private readonly timeBaseUrl = `${environment.baseUrl}`

  constructor(private httpClient: HttpClient ) { }

  getListCodeCompanies():Observable<any>{
    let urlApi=this.timeBaseUrl+'list_code_companies'
    return this.httpClient.get(urlApi)
  }

  getListStates():Observable<any>{
    let urlApi=this.timeBaseUrl+'list_state'
    return this.httpClient.get(urlApi)
  }

  getListCity():Observable<any> {
    let urlApi=this.timeBaseUrl+'list_city'
    return this.httpClient.get(urlApi)
  }

  public meanDelayByTime(paramGraphElement: String,codeStateOrigin: String,codeStateDest: String):Observable<any>{
    let urlApi=this.timeBaseUrl+'delay_option_by_year?option='+paramGraphElement + '&codeStateOrigin='+codeStateOrigin+'&codeStateDest='+codeStateDest
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }

  public meanDelayByHour(codeStateOrigin: String,codeStateDest: String, hour: String):Observable<any>{
    let urlApi=this.timeBaseUrl+'calculate_delay_by_2hour?codeStateOrigin='+codeStateOrigin+'&codeStateDest='+codeStateDest +"&hour="+hour
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }

  public meanDelayDayMonth(paramGraphOption1:string,paramGraphOption2:string,airport_depart:string,airport_arrive:string):Observable<any>{
    let urlApi=this.timeBaseUrl+'delay_by_day_month?option1='+paramGraphOption1+'&option2='+paramGraphOption2+'&ville_depart='+encodeURIComponent(airport_depart)+'&ville_arrive='+encodeURIComponent(airport_arrive);
    console.log(urlApi);
    return this.httpClient.get(urlApi);
  }


}
