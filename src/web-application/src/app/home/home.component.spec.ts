import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";

import { HomeComponent } from './home.component';
import {AppraisalsService} from "./appraisals.service";
import {APPRAISALS_KEY_INFO, EXPECTED_APPRAISALS, NO_APPRAISALS_MESSAGE} from "../../testing/expectedValues";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockService : AppraisalsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
          AppraisalsService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    mockService = TestBed.get(AppraisalsService);
    spyOn(mockService, 'getAwaitingAppraisals').and.returnValue(of(EXPECTED_APPRAISALS));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get awaiting appraisals', () => {
    const appraisalElement : HTMLElement = fixture.nativeElement;
    const appraisals = appraisalElement.querySelectorAll("a");
    expect(appraisals.length).toEqual(2);

    appraisals.forEach(function(item, key) {
      const appraisalId = item.querySelector(".appraisal-heading");
      let headingString = "Appraisal No. " + APPRAISALS_KEY_INFO[key]["appraisalId"];
      expect(appraisalId.textContent).toEqual(headingString);

      const carReg = item.querySelector('#reg-plate');
      expect(carReg.textContent).toEqual(APPRAISALS_KEY_INFO[key]["carInfo"])
    })
  });

  it('should display message when no appraisals found', () => {
    component.noAppraisalsFound = true;
    fixture.detectChanges();

    const appraisalElement : HTMLElement = fixture.nativeElement;
    const errorMessage = appraisalElement.querySelector(".error h2");

    expect(errorMessage.textContent).toEqual(NO_APPRAISALS_MESSAGE);
  })

});
