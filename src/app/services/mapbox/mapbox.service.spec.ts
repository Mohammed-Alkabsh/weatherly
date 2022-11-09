import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MapboxService } from './mapbox.service';

describe('MapboxService', () => {
  let service: MapboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MapboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
