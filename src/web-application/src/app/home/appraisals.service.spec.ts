import { TestBed } from '@angular/core/testing';

import { AppraisalsService } from './appraisals.service';
import {HttpClientModule} from "@angular/common/http";

describe('AppraisalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: AppraisalsService = TestBed.get(AppraisalsService);
    expect(service).toBeTruthy();
  });
});
