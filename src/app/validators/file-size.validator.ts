import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fileSizeValidator(maxSizeInKB: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    
    const size = control.value;
    
    if (size > (maxSizeInKB * 1024)){
      const obj =  { fileSizeExceeded: {
        actualSize: `${size/1024}kb`,
        maxSizeInKB: '10kb'
      } };
      console.log(obj)
      return obj
    }
    return null;
  };
}
