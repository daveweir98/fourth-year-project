import { Component, OnInit } from '@angular/core';
import {AppraisalsService} from "./appraisals.service";
import {convertEpoch} from "../helpers/epoch.convertor";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  awaitingAppraisals: JSON;
  noAppraisalsFound : boolean;

  constructor(private appraisalService: AppraisalsService) { }

  ngOnInit() {
    this.getAwaitingAppraisals();
  }

  getAwaitingAppraisals(): void {
    this.appraisalService.getAwaitingAppraisals().subscribe((data: JSON) => {
      this.awaitingAppraisals = data;

      let appraisalCount = Object.keys(this.awaitingAppraisals).length;
      for(let i=0; i < appraisalCount; i++) {
        let appraisal = this.awaitingAppraisals[i];

        appraisal["returnDate"] = convertEpoch(appraisal["returnDate"]);
        appraisal["rentalDate"] = convertEpoch(appraisal["rentalDate"]);

        this.awaitingAppraisals[i] = appraisal;
      }

      this.noAppraisalsFound = (Object.keys(this.awaitingAppraisals).length) == 0;
    });
  }

}
