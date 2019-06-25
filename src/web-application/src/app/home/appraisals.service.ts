import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppraisalsService {

  constructor(private http: HttpClient) { };

  getAwaitingAppraisals() {

    let httpAppraisals = this.http.get("http://localhost:8080/getAwaitingAppraisals/");

    let awaitingAppraisals: JSON;

    return httpAppraisals;
  }

}
