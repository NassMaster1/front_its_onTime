import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private readonly predictinBaseUrl = `${environment.baseUrl}`

  constructor(private httpClient: HttpClient ) { }


  public predictionFlight(paramGraphElement: object):Observable<any>{
    let urlApi=this.predictinBaseUrl+'predict'
    return this.httpClient.post(urlApi, paramGraphElement)

    console.log(urlApi)
    return this.httpClient.get(urlApi)
  }
}
