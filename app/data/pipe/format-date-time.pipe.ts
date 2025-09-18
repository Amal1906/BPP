import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateTime',
  standalone: true
})
export class FormatDataTimePipe implements PipeTransform {

    constructor(private datePipe: DatePipe){}
    timezone = 'America/Chicago';

    /**
   * Transforms an input date string to the specified format.
   * If the input string does not end with 'Z', appends 'Z' to treat it as UTC.
   * 
   * @param value - The input date string to be formatted.
   * @param format - (Optional) The desired output format (default: 'MM-dd-yyyy, HH:mm').
   * @returns A formatted date string in the specified format, or '-' if invalid, or '' if no value provided.
   */
  
    transform(value: string, format: string = 'MM-dd-yyyy, HH:mm'): string {
      if (!value) {
        return '';
      }
      let localDateTime;
      if (typeof value == 'string' && !value.endsWith('Z')) {
        localDateTime = value + 'Z';
      } else {
        localDateTime =value;
      }
      return this.datePipe.transform(localDateTime, format, 'UTC')|| '-';
    }

}
