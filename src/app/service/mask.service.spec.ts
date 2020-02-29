import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaskService } from './mask.service';

describe('MaskService', () => {
  let service: MaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
