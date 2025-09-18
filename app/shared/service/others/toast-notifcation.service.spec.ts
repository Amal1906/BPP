import { TestBed } from '@angular/core/testing';

import { ToastNotifcationService } from './toast-notifcation.service';

describe('ToastNotifcationService', () => {
  let service: ToastNotifcationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastNotifcationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
