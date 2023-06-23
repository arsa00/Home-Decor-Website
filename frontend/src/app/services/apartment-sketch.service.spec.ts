import { TestBed } from '@angular/core/testing';

import { ApartmentSketchService } from './apartment-sketch.service';

describe('ApartmentSketchService', () => {
  let service: ApartmentSketchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApartmentSketchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
