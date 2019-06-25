import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute, convertToParamMap} from "@angular/router";
import {of} from "rxjs";

import {HistoryService} from "./history.service";
import { HistoryComponent } from './history.component';
import {HISTORY_KEY_DATES, HISTORY_NO_APPRAISALS_MESSAGE, EXPECTED_APPRAISALS} from '../../testing/expectedValues';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let mockService : HistoryService;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryComponent ],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({"carRegistration": "06-D-11580"})),
          },
        },
        HistoryService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    mockService = TestBed.get(HistoryService);
    spyOn(mockService, 'getAllAppraisalsForCar').and.returnValue(of(EXPECTED_APPRAISALS))
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the registration from the URL', () => {
    component.getCarRegistrationFromUrl();
    expect(component.carRegistration).toEqual("06-D-11580");

    // ensure it is present in the UI
    const historyElement : HTMLElement = fixture.nativeElement;
    const h2 = historyElement.querySelector('h2');
    expect(h2.textContent).toEqual(component.carRegistration)
  });

  it('should get all appraisals from service', () => {
    component.getAllAppraisalsForCar();

    const historyElement : HTMLElement = fixture.nativeElement;
    const historyContent = historyElement.querySelectorAll('.history-content');

    historyContent.forEach(function(item, key) {
      const rentalDate = item.querySelector(".rental-date h5");
      expect(rentalDate.textContent).toEqual(HISTORY_KEY_DATES[key]["rentalDate"]);
      const returnDate = item.querySelector(".return-date h5");
      expect(returnDate.textContent).toEqual(HISTORY_KEY_DATES[key]["returnDate"]);
    })

  });

  it('should display message when no appraisals found', () => {
    component.appraisalsFound = false;
    fixture.detectChanges();

    const historyElement : HTMLElement = fixture.nativeElement;
    const errorMessage = historyElement.querySelector(".error");

    expect(errorMessage.textContent).toEqual(HISTORY_NO_APPRAISALS_MESSAGE)
  })

});

