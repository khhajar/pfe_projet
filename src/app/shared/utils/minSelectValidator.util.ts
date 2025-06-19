import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Generic validator to ensure that the control's value is an array
 * with at least a minimum number of items.
 * @param min The minimum number of items required.
 * @returns Validation error or null if valid.
 */
export function minSelectValidator(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    // Get the value of the control, expected to be an array.
    const value = control.value;

    // Check if the value is an array and its length meets the minimum requirement.
    if (Array.isArray(value) && value.length >= min) {
      return null; // Valid if the condition is met.
    }
    return {
      minItems: { requiredMin: min, actualLength: value ? value.length : 0 },
    }; // Return an error object with details.
  };
}
