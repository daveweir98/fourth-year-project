import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {SearchService} from "./search.service";
import {of} from "rxjs";
import {SEARCH_COUNT, SEARCH_ERRORS, SEARCH_RESULTS} from "../../testing/expectedValues";

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockService : SearchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule],
      declarations: [ SearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    mockService = TestBed.get(SearchService);
    spyOn(mockService, 'getSearchResults').and.returnValue(of(SEARCH_RESULTS));
    spyOn(mockService, 'getAppraisalCount').and.returnValue(of(SEARCH_COUNT));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the static content of the search page', () => {
    const compiled = fixture.debugElement.nativeElement;
    // contains the search heading
    expect(compiled.querySelector('h1').textContent).toContain('Search');
    // contains the instructions paragraph
    let instructions: string = "Input the registration plate of the car below";
    expect(compiled.querySelector('p').textContent).toContain(instructions);
    // loads the correct amount of inputs
    expect((compiled.querySelectorAll('input[type=text]')).length).toEqual(1);
    expect((compiled.querySelectorAll('input[type=submit]')).length).toEqual(1);
  });

  it('should display search results when provided valid input', () => {
    let searchElement : HTMLElement = fixture.nativeElement;
    const submitButton : HTMLInputElement = searchElement.querySelector("input[type=submit");

    let searchComponent : SearchComponent = fixture.componentInstance;
    searchComponent.searchForm.controls["searchTerm"].setValue("06-D-11580");

    submitButton.click();

    fixture.detectChanges();

    const carDetails = searchElement.querySelector("#car-details");

    const makeModel = carDetails.querySelector("h4");
    const reg = carDetails.querySelector("h5");

    expect(makeModel.textContent).toEqual(SEARCH_RESULTS["make"] + ", " + SEARCH_RESULTS["model"])
    expect(reg.textContent).toEqual(SEARCH_RESULTS["carRegistration"]);
  })

  it('should display the appraisal count when provided a valid input', () => {
    let searchElement : HTMLElement = fixture.nativeElement;
    const submitButton : HTMLInputElement = searchElement.querySelector("input[type=submit");

    let searchComponent : SearchComponent = fixture.componentInstance;
    searchComponent.searchForm.controls["searchTerm"].setValue("06-D-11580");

    submitButton.click();

    fixture.detectChanges();

    const appraisalDetails = searchElement.querySelector("#appraisal-details");

    const appraisalCount = appraisalDetails.querySelector("h2");

    expect(appraisalCount.textContent).toEqual("" + SEARCH_COUNT);
  })

  it('should display an error message when provided no input', () => {
    let searchElement : HTMLElement = fixture.nativeElement;
    const submitButton : HTMLInputElement = searchElement.querySelector("input[type=submit");

    submitButton.click();

    fixture.detectChanges();

    const errorDiv = searchElement.querySelector(".error");
    const errorMessage = errorDiv.querySelector("p");

    expect(errorMessage.textContent).toEqual(SEARCH_ERRORS[0]);
  })

  it('should display an error when provided invalid input', () => {
    let searchElement : HTMLElement = fixture.nativeElement;
    const submitButton : HTMLInputElement = searchElement.querySelector("input[type=submit");

    let searchComponent : SearchComponent = fixture.componentInstance;
    searchComponent.searchForm.controls["searchTerm"].setValue("1234-D-11580");

    submitButton.click();

    fixture.detectChanges();

    const errorDiv = searchElement.querySelector(".error");
    const errorMessage = errorDiv.querySelector("p");

    expect(errorMessage.textContent).toEqual(SEARCH_ERRORS[1]);
  })
});
