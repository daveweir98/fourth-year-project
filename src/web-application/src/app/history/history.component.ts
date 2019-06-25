import { Component, OnInit } from '@angular/core';
import {HistoryService} from "./history.service";
import {ActivatedRoute} from "@angular/router";
import {convertEpoch} from "../helpers/epoch.convertor";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  appraisals:JSON;
  carRegistration: string;

  appraisalsFound: Boolean = true;

  constructor(private historyService: HistoryService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getCarRegistrationFromUrl();
    this.getAllAppraisalsForCar();
  }

  getAllAppraisalsForCar() : void {
    this.historyService.getAllAppraisalsForCar(this.carRegistration).subscribe( (data:JSON) => {
      this.appraisals = data;

      let appraisalCount = Object.keys(this.appraisals).length;
      for(let i=0; i < appraisalCount; i++) {
        let appraisal = this.appraisals[i];

        appraisal["returnDate"] = convertEpoch(appraisal["returnDate"]);
        appraisal["rentalDate"] = convertEpoch(appraisal["rentalDate"]);

        this.appraisals[i] = appraisal;
      }

      if (appraisalCount < 1) {
        this.appraisalsFound = false;
      }
    })
  }

  getCarRegistrationFromUrl() : void {
    this.route.paramMap.subscribe(params => {
      this.carRegistration = params.get("carRegistration");
    })
  }

  setAppraisalIndicator(appraisalComplete:boolean) : object{
    let styles = {};
    if (appraisalComplete) {
      styles = {
        'background-color': 'red'
      };
    } else {
      styles = {
        'background-color': 'green'
      };
    }

    return styles
  }

}
