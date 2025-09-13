import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date | undefined | null): string {
    if (!value) return '';

    const date = new Date(value);
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
