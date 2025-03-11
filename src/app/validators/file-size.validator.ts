import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fileSizeValidator(maxSizeInKB: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    
    const sizes = control.value;
    if (sizes.length>5){
      return { fileCountExceeded: {
        numSelected: sizes.length,
        numLimit: 5
      }}
    }
    for (let size of sizes){
      if (size > (maxSizeInKB * 1024)){
        const obj =  { fileSizeExceeded: {
          actualSize: `${size/1024}kb`,
          maxSizeInKB: '10kb'
        } };
        console.log(obj)
        return obj
      }
    }
    return null;
  };
}
