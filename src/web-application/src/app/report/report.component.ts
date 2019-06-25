import { Component, OnInit } from '@angular/core';
import {ReportService} from "./report.service";
import {ActivatedRoute} from "@angular/router";
import { RouterModule, Router } from '@angular/router';
import {convertEpoch} from "../helpers/epoch.convertor";

@Component({
  selector: 'app-appraisal',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  reportContent: JSON;
  appraisalId: number;
  images = [];

  constructor(private reportService: ReportService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getAppraisalIdFromUrl();
    this.getReport();
  }

  getReport() : void {
    this.reportService.getReports(this.appraisalId).subscribe((data:JSON) => {
      this.reportContent = data;
      this.reportContent["returnDate"] = convertEpoch(this.reportContent["returnDate"]);
      this.reportContent["rentalDate"] = convertEpoch(this.reportContent["rentalDate"]);
      //console.log(this.reportContent);
    });
  }

  getAppraisalIdFromUrl() : void {
    this.route.paramMap.subscribe( params => {
      this.appraisalId = +params.get("appraisalId");
    });
  }

  completeAppraisal(appraisalId : number) : void {
    if (confirm("Are you sure you wish to mark this appraisal as complete?")) {
      this.reportService.markAppraisalAsComplete(appraisalId).subscribe(data => {
        this.getReport();
      });
    }
  }

  flagAppraisal(appraisalId : number) : void {
    if (confirm("Are you sure you wish to flag this appraisal?")) {
      this.reportService.flagAppraisal(appraisalId).subscribe( data => {
        this.getReport();
      })
    }
  }

  presentModal:boolean = false;
  imageIndex:number = 0;

  modal(imageIndex : number) : void {
    this.imageIndex = imageIndex;
    this.presentModal = true;
    
    this.images.push(this.reportContent["imagesAccess"]["front"]);
    this.images.push(this.reportContent["imagesAccess"]["back"]);
    this.images.push(this.reportContent["imagesAccess"]["left_side"]);
    this.images.push(this.reportContent["imagesAccess"]["right_side"]);

  }

  closeModal() : void {
    this.presentModal = false;
  }

  moveLeft() : void {
    this.imageIndex -= 1;
    if (this.imageIndex < 0) {
      this.imageIndex = this.images.length - 1;
    }
  }

  moveRight() : void {
    this.imageIndex += 1;
    if (this.imageIndex >= this.images.length) {
      this.imageIndex = 0;
    }
  }

}
