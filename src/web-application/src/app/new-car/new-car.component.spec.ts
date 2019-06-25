import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCarComponent } from './new-car.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NewCarService} from "./new-car.service";
import {of} from "rxjs";
import {NEW_CAR_ERRORS} from "../../testing/expectedValues";


describe('NewCarComponent', () => {
  let component: NewCarComponent;
  let fixture: ComponentFixture<NewCarComponent>;
  let mockService : NewCarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule],
      declarations: [ NewCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCarComponent);
    mockService = TestBed.get(NewCarService);
    spyOn(mockService, 'addNewCarToDatabase').and.returnValue(of({}));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const newCarElement : HTMLElement = fixture.nativeElement;
    const title = newCarElement.querySelector("h1").textContent;
    expect(title).toEqual("Add Car");
    const inputHeaders = newCarElement.querySelectorAll("h4");
    const actualHeaders = ["Car Registration", "Make", "Model"];
    for (let i=0; i < inputHeaders.length; i++) {
      expect(inputHeaders[i].textContent).toEqual(actualHeaders[i]);
    }
    expect(component).toBeTruthy();
  });

  it('should produce error for empty inputs', () => {
    let newCarElement : HTMLElement = fixture.nativeElement;
    const submitButton : HTMLInputElement = newCarElement.querySelector("input[type=submit]");

    submitButton.click();

    fixture.detectChanges();

    let errors = (newCarElement.querySelectorAll(".error"));

    errors.forEach(function(error, key) {
      //console.log(error.textContent);
      //console.log(NEW_CAR_ERRORS[key]);
      expect(error.textContent).toEqual(NEW_CAR_ERRORS[key]);
    });

  });

  it('should produce error for invalid registration', () => {
    let newCarElement : HTMLElement = fixture.nativeElement;
    const submitButton : HTMLInputElement = newCarElement.querySelector("input[type=submit]");

    let newCarComponent : NewCarComponent = fixture.componentInstance;
    newCarComponent.newCarForm.controls["regPlateInput"].setValue("1223-D-1234");
    newCarComponent.newCarForm.controls["carMakeInput"].setValue("Nissan");
    newCarComponent.newCarForm.controls["carModelInput"].setValue("Micra");

    submitButton.click();

    fixture.detectChanges();

    let errors = (newCarElement.querySelectorAll(".error"));

    errors.forEach(function(error, key) {
      if(key == 0) {
        key += 3;
      }
      expect(error.textContent).toEqual(NEW_CAR_ERRORS[key]);
    });
  });

  it('should add new car with valid input', () => {
    let newCarElement : HTMLElement = fixture.nativeElement;
    const submitButton : HTMLInputElement = newCarElement.querySelector("input[type=submit]");

    let newCarComponent : NewCarComponent = fixture.componentInstance;
    newCarComponent.newCarForm.controls["regPlateInput"].setValue("123-D-1234");
    newCarComponent.newCarForm.controls["carMakeInput"].setValue("Nissan");
    newCarComponent.newCarForm.controls["carModelInput"].setValue("Micra");

    submitButton.click();

    fixture.detectChanges();

    let errors = (newCarElement.querySelectorAll(".error"));

    expect(errors.length).toEqual(0);
    expect(newCarComponent.carAlreadyPresent).toBeFalsy();
    expect(newCarComponent.carSuccessfullyAdded).toBeTruthy();
  })
});
