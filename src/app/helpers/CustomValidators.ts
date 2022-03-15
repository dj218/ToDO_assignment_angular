import {
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


export function validateDueDate(controlName: string)
{ 

    const currentDateTime = new Date();
    currentDateTime.setHours(0,0,0,0);

    const controlValue = new Date(controlName);
    controlValue.setHours(0,0,0,0);

    console.log(currentDateTime+'-'+controlValue)

    if(currentDateTime<controlValue)
    {
        return {response: true};
    }
    return null;
}