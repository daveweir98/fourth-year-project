import { TestBed } from '@angular/core/testing';

import { NewCarService } from './new-car.service';
import {HttpClientModule} from "@angular/common/http";

describe('NewCarService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: NewCarService = TestBed.get(NewCarService);
    expect(service).toBeTruthy();
  });
});
