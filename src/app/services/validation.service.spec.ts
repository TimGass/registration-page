import { TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';
import { HttpClientModule } from "@angular/common/http";

describe('ValidationService', () => {
  let service: ValidationService;

  //all methods tested in directives section and depend on controls that must be provided by component

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ValidationService);
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
  });
});
