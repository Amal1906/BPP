import { FormatDataTimePipe } from './format-date-time.pipe';
import { DatePipe } from '@angular/common';

describe('FormatDateTimePipe', () => {
  it('create an instance', () => {
    const datePipe = new DatePipe('en-US');
    const pipe = new FormatDataTimePipe(datePipe);
    expect(pipe).toBeTruthy();
  });
});
