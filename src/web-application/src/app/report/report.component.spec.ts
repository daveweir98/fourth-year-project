import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute, convertToParamMap} from "@angular/router";
import {of} from "rxjs";

import { ReportComponent } from './report.component';
import {ReportService} from "./report.service";
import {
    REPORT_ATTRIBUTES_TO_CHECK,
    REPORT_EXPECTED_INFO,
    REPORT_EXPECTED_INFO_COMPLETE
} from "../../testing/expectedValues";

 describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let mockService : ReportService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportComponent ],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({"appraisalId": 1}))
          }
        },
        ReportService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    mockService = TestBed.get(ReportService);
    spyOn(mockService, 'getReports').and.returnValue(of(REPORT_EXPECTED_INFO));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the appraisal Id from the URL', () => {
    expect(component.appraisalId).toEqual(1);
  });

  it('should hold information for the report', () => {
    const reportElement : HTMLElement = fixture.nativeElement;
    const tableData = reportElement.querySelectorAll("td");

    tableData.forEach(function(item, key) {
      const correctAttribute = REPORT_ATTRIBUTES_TO_CHECK[key];

      expect(item.textContent).toEqual(correctAttribute);
    })
  });

  it('should have a button when appraisal is not complete otherwise, no button', () => {
    const reportElement : HTMLElement = fixture.nativeElement;

    let input = reportElement.querySelector("input");

    expect(input).toBeTruthy();

    component.reportContent["appraisalComplete"] = true;
    fixture.detectChanges();

    input = reportElement.querySelector("input");

    expect(input).toBeFalsy();

    component.reportContent["appraisalComplete"] = false;
  });

  it('should complete an appraisal when the complete appraisal button is clicked', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const reportElement : HTMLElement = fixture.nativeElement;

    let completeAppraisalButton : HTMLAnchorElement = reportElement.querySelector("#complete-appraisal");

    let status = reportElement.querySelector("#open");
    expect(status).not.toBeNull();
    status = reportElement.querySelector("#closed");
    expect(status).toBeNull();
    status = reportElement.querySelector("#flagged");
    expect(status).toBeNull();

    completeAppraisalButton.click();
    component.reportContent["appraisalComplete"] = true;
    fixture.detectChanges();

    status = reportElement.querySelector("#open");
    expect(status).toBeNull();
    status = reportElement.querySelector("#closed");
    expect(status).not.toBeNull();
    status = reportElement.querySelector("#flagged");
    expect(status).toBeNull();

      component.reportContent["appraisalComplete"] = false;
  });

  it('should flag an appraisal when the flag appraisal button is clicked', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const reportElement : HTMLElement = fixture.nativeElement;

    let flagAppraisalButton : HTMLAnchorElement = reportElement.querySelector("#flag-appraisal");
    
    let status = reportElement.querySelector("#flagged");
    expect(status).toBeNull();

    flagAppraisalButton.click();
    component.reportContent["damagePresent"] = false;
    fixture.detectChanges();

    status = reportElement.querySelector("#flagged");
    expect(status).not.toBeNull();
 });

  it('should open the gallery modal when an image is clicked', () => {
    const reportElement : HTMLElement = fixture.nativeElement;

    let imageDiv = reportElement.querySelector("#before-images");

    let clickableImage = imageDiv.querySelector("img");

    let galleryModal = reportElement.querySelector("#modalContainer");
    // gallery modal to be hidden from view
    expect(galleryModal).toBeNull();

    clickableImage.click();

    fixture.detectChanges();

    galleryModal = reportElement.querySelector("#modalContainer");
    // gallery modal to not be present after image is clicked
    expect(galleryModal).not.toBeNull()
  });

  it('should close the gallery modal when the close button is clicked', () => {
      const reportElement : HTMLElement = fixture.nativeElement;

      let imageDiv = reportElement.querySelector("#before-images");

      let clickableImage = imageDiv.querySelector("img");

      let galleryModal = reportElement.querySelector("#modalContainer");
      // gallery modal to be hidden from view
      expect(galleryModal).toBeNull();

      clickableImage.click();

      fixture.detectChanges();

      galleryModal = reportElement.querySelector("#modalContainer");
      // gallery modal to not be present after image is clicked
      expect(galleryModal).not.toBeNull()

      let closeButton : HTMLAnchorElement = reportElement.querySelector("#closeButton");
      closeButton.click();

      fixture.detectChanges();
      galleryModal = reportElement.querySelector("#modalContainer");
      // gallery modal to not be present after image is clicked
      expect(galleryModal).toBeNull()
  });

  it('should iterate through images in the gallery', () => {
      const reportElement : HTMLElement = fixture.nativeElement;

      let imageDiv = reportElement.querySelector("#before-images");

      let clickableImage = imageDiv.querySelector("img");
      clickableImage.click();

      fixture.detectChanges();

      let rightArrow : HTMLAnchorElement = reportElement.querySelector("#rightArrow");
      let leftArrow : HTMLAnchorElement = reportElement.querySelector("#leftArrow");

      let modalImage : HTMLImageElement = reportElement.querySelector('#modalImg');
      let imageFilename : string = modalImage.src.split("/")[7];
      expect(component.imageIndex).toEqual(0);
      expect(imageFilename).toEqual("front.jpg");

      rightArrow.click();
      fixture.detectChanges();
      modalImage = reportElement.querySelector('#modalImg');
      imageFilename = modalImage.src.split("/")[7];
      expect(component.imageIndex).toEqual(1);
      expect(imageFilename).toEqual("back.jpg");

      leftArrow.click();
      fixture.detectChanges();
      modalImage = reportElement.querySelector('#modalImg');
      imageFilename = modalImage.src.split("/")[7];
      expect(component.imageIndex).toEqual(0);
      expect(imageFilename).toEqual("front.jpg");

      // test overflow (last image to first image & first image to last image)
      leftArrow.click();
      expect(component.imageIndex).toEqual(3);
      rightArrow.click();
      expect(component.imageIndex).toEqual(0);
  });
});
