import { TestBed } from '@angular/core/testing';

import { HistoryService } from './history.service';
import {HttpClientModule} from "@angular/common/http";

describe('HistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: HistoryService = TestBed.get(HistoryService);
    expect(service).toBeTruthy();
  });
});
