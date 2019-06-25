import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import {SearchService} from "./search.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  searchTerm: string;
  regPlatePattern = new RegExp('^[0-9]{2,3}-[A-Z]{1,2}-[0-9]{1,6}$');
  searchResults:JSON;
  appraisalCount:number;

  submitted: Boolean = false;
  success: Boolean = false;

  constructor(private formbuilder: FormBuilder, private searchService: SearchService) {
    this.searchForm = this.formbuilder.group({
      searchTerm: ['', [Validators.required, Validators.pattern(this.regPlatePattern)]]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.searchForm.invalid) {
      this.errorFlash();
      return;
    }

    this.searchTerm = this.searchForm.controls.searchTerm.value;
    this.success = true;

    this.executeQuery();

  }

  errorFlash(): void {
    let inputBox: HTMLElement = document.getElementById('searchInput');
    inputBox.setAttribute("style", "box-shadow: 0px 0px 0px 3px red;");
    window.setTimeout(this.undoErrorFlash, 1000);
  }

  undoErrorFlash() : void {
    let inputBox: HTMLElement = document.getElementById('searchInput');
    inputBox.setAttribute("style", "box-shadow: 0;");
  }

  executeQuery() {
    this.searchService.getSearchResults(this.searchTerm).subscribe((data:JSON) => {
      this.searchResults = data;
      this.getAppraisalCountForResult();
    })
  }

  getAppraisalCountForResult() : void {
    this.searchService.getAppraisalCount(this.searchTerm).subscribe((data:number) => {
      this.appraisalCount = data;
    })
  }

  ngOnInit() {
  }



}
