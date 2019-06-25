import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewCarService} from "./new-car.service";

@Component({
  selector: 'app-new-car',
  templateUrl: './new-car.component.html',
  styleUrls: ['./new-car.component.css']
})
export class NewCarComponent implements OnInit {

  newCarForm: FormGroup;
  regPlateInput: string;
  carMakeInput: string;
  carModelInput: string;
  regPlatePattern = new RegExp('^[0-9]{2,3}-[A-Z]{1,2}-[0-9]{1,6}$');

  submitted: Boolean = false;
  success: Boolean = false;

  carAlreadyPresent : Boolean = false;
  carSuccessfullyAdded : Boolean = false;

  constructor(private formbuilder: FormBuilder, private newCarService: NewCarService) {
    this.newCarForm = this.formbuilder.group({
      regPlateInput: ['', [Validators.required, Validators.pattern(this.regPlatePattern)]],
      carMakeInput: ['', Validators.required],
      carModelInput: ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;

    if (this.newCarForm.invalid) {
      this.errorFlash();
      return
    }

    this.regPlateInput = this.newCarForm.controls.regPlateInput.value;
    this.carMakeInput = this.newCarForm.controls.carMakeInput.value;
    this.carModelInput = this.newCarForm.controls.carModelInput.value;

    this.success = true;

    this.addNewCar();
  }

  errorFlash(): void {
    let inputBox: HTMLElement = document.getElementById('regPlateInput');
    inputBox.setAttribute("style", "box-shadow: 0px 0px 0px 3px red;");
    inputBox = document.getElementById('carMake');
    inputBox.setAttribute("style", "box-shadow: 0px 0px 0px 3px red;");
    inputBox = document.getElementById('carModel');
    inputBox.setAttribute("style", "box-shadow: 0px 0px 0px 3px red;");

    window.setTimeout(this.undoErrorFlash, 1000);
  }

  undoErrorFlash() : void {
    let inputBox: HTMLElement = document.getElementById('regPlateInput');
    inputBox.setAttribute("style", "box-shadow: 0;");
    inputBox = document.getElementById('carMake');
    inputBox.setAttribute("style", "box-shadow: 0;");
    inputBox = document.getElementById('carModel');
    inputBox.setAttribute("style", "box-shadow: 0;");

  }

  addNewCar() : void {
    let carInfo = {
      "carRegistration" : this.regPlateInput,
      "make" : this.carMakeInput,
      "model" : this.carModelInput
    }
    this.newCarService.addNewCarToDatabase(carInfo).subscribe((data => {
      //console.log(data);
      this.carAlreadyPresent = false;
      this.carSuccessfullyAdded = true;
    }), err => {
      this.carAlreadyPresent = true;
      this.carSuccessfullyAdded = false;
    });
  }

}
