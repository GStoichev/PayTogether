/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CheckService } from './check.service';

describe('Service: Check', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckService]
    });
  });

  it('should ...', inject([CheckService], (service: CheckService) => {
    expect(service).toBeTruthy();
  }));
});
