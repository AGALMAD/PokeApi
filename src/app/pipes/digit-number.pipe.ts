import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'digitNumber',
  standalone: true
})
export class DigitNumberPipe implements PipeTransform {

  transform(value: number, digits: number): string { //devuelte un String con el número generado con el número de digitos que se asigne
    return value.toString().padStart(digits, '0');
  }
}
