import { TestBed } from '@angular/core/testing';

import { CauseDelayService } from './cause-delay.service';

describe('CauseDelayService', () => {
  let service: CauseDelayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CauseDelayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
