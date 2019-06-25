import { Injectable } from '@angular/core';

import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NewCarService {

  constructor(private http: HttpClient) { }

  addNewCarToDatabase(carInformation : object) {

    let httpResults = this.http.post("http://localhost:8080/addNewCar", carInformation);

    return httpResults;
  }
}
