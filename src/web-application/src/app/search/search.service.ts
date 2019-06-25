import { Injectable } from '@angular/core';

import {HttpClient, HttpParams} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  getSearchResults(queryCarRegistration : string) {
    const options = queryCarRegistration ? { params: new HttpParams().set("queryCarRegistration", queryCarRegistration)} : {};

    let httpResults = this.http.get("http://localhost:8080/getSearchResults", options);

    return httpResults;
  }

  getAppraisalCount(queryCarRegistration : string) {
    const options = queryCarRegistration ? { params: new HttpParams().set("queryCarRegistration", queryCarRegistration)} : {};

    let httpResults = this.http.get("http://localhost:8080/getNumberOfAppraisalsByCar", options);

    return httpResults;
  }
}
