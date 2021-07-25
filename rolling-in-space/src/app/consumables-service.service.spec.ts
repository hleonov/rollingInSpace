import { TestBed } from '@angular/core/testing';

import { ConsumablesService } from './consumables-service.service';

describe('ConsumablesServiceService', () => {
  let service: ConsumablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
