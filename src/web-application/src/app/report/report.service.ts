import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { };

  getReports(appraisalId : number) {

    const options = appraisalId ? { params: new HttpParams().set('stringAppraisalId', ""+appraisalId) } : {};

    let httpReport = this.http.get("http://localhost:8080/getReport", options);

    return httpReport;

  }

  markAppraisalAsComplete(appraisalId : number) {

    let httpReport = this.http.put("http://localhost:8080/markAppraisalComplete", ""+appraisalId);

    return httpReport;
  }

  flagAppraisal(appraisalId : number) {
    let httpReport = this.http.put("http://localhost:8080/flagAppraisal", ""+appraisalId);

    return httpReport
  };

}