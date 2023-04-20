import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CauseDelayService {
  private readonly causeBaseUrl = `${environment.baseUrl}`

  constructor(private httpClient: HttpClient ) { }

  // getListCodeCompanies():Observable<any>{
  //   let urlApi=this.causeBaseUrl+'origins'
  //   console.log(this.httpClient.get(urlApi))
  //   return this.httpClient.get(urlApi)
  // }

  // getListStates():Observable<any>{
  //   let urlApi=this.causeBaseUrl+'destinations'
  //   return this.httpClient.get(urlApi)
  // }

  getListStates():Observable<any>{
    let urlApi=this.causeBaseUrl+'origins'
    return this.httpClient.get(urlApi)
  }

  // public meanDelayCompanies(paramGraphElement: String, paramGraphElement2: String):Observable<any>{
  //   let urlApi=this.causeBaseUrl+'causes_delay?OriginCityName='+paramGraphElement+'&DestCityName='+paramGraphElement2
  //   console.log(urlApi)
  //   alert(paramGraphElement)
  //   alert(paramGraphElement2)
  //   return this.httpClient.get(urlApi)
  // }

  
  public delayStates(paramGraphOrigin: String, paramGraphDest: String):Observable<any>{
    let urlApi=this.causeBaseUrl+'causes_delay?OriginCityName='+paramGraphOrigin+'&DestCityName='+paramGraphDest
    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }
}
