import {
  AbstractControl,
  FormControl,
  FormGroup
} from '@angular/forms';

export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({
        mustMatch: true
      });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function LessThanToday(control: AbstractControl) {
  const currentDateTime: Date = new Date();

  if(new Date(control.value) < currentDateTime)
  {
    return {"LessThanToday" : true}
  }
  else{
    return null;
  }
}

export function GreaterThanDueDate(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (control.errors && !control.errors['GreaterThanDueDate']) {
      return;
    }

    // set error on matchingControl if validation fails
    if (new Date(control.value) > new Date(matchingControl.value)) {
      control.setErrors({
        GreaterThanDueDate: true
      });
    } else {
      control.setErrors(null);
    }
  };
}
