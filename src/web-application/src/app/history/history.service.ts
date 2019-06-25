import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http : HttpClient) { };

  getAllAppraisalsForCar(carRegistration : string) {

    const options = carRegistration ? { params: new HttpParams().set('queryCarRegistration', carRegistration) } : {};

    let httpReport = this.http.get("http://localhost:8080/getAllAppraisalsForCar", options);

    return httpReport;
  }
}
