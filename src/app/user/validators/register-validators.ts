/* static methods are good for utility methods. But they have the 
   limitation of his scope. */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// This is a syncrhonous validator:
export class RegisterValidators {
    static match(controlName: string, matchingControlName: string): ValidatorFn {

        // Factory function:
        return (group: AbstractControl): ValidationErrors | null => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchingControlName);

            if(!control || !matchingControl) {
                console.error('Form controls cannot be found in the form group.');
                
                return { 
                    controlNotFound: false 
                };
            } 

            const error = control.value === matchingControl.value ? 
                null : { noMatch: true };

            matchingControl.setErrors(error);

            return error;
        }
    }
}
