import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-social-links-form',
  templateUrl: './social-links-form.component.html',
  styleUrls: ['./social-links-form.component.css'],
})
export class SocialLinksFormComponent implements OnInit {
  @Input() fields: { key: string; label: string; placeholder: string }[] = [];
  socialLinksForm!: FormGroup;
  isLoading: boolean = true;
  @Output() save = new EventEmitter<{ [key: string]: string }>();

  constructor(
    private fb: FormBuilder,
    private readonly toastr: ToastrService
  ) {}

  private _initialValues: { [key: string]: string } = {};

  @Input() set initialValues(values: { [key: string]: string }) {
    this._initialValues = values;
    if (this.socialLinksForm) {
      this.updateFormValues();
    }
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const group: { [key: string]: any } = {};

    this.fields.forEach((field) => {
      group[field.key] = [
        this._initialValues[field.key] || '',
        [Validators.required, Validators.pattern('https?://.+')],
      ];
    });

    this.socialLinksForm = this.fb.group(group);
    this.updateFormValues();
  }

  private updateFormValues() {
    setTimeout(() => {
      let allValuesSet = true;

      Object.keys(this._initialValues).forEach((key) => {
        if (this.socialLinksForm.controls[key]) {
          this.socialLinksForm.controls[key].setValue(this._initialValues[key]);
        } else {
          allValuesSet = false;
        }
      });
      if (
        allValuesSet ||
        Object.values(this._initialValues).every((val) => val == '')
      ) {
        this.isLoading = false;
      }
    }, 1000);
  }

  onSave() {
    if (!this.socialLinksForm.valid) {
      this.toastr.warning(
        'Please fill in all required fields correctly.',
        'Warning'
      );
      return;
    }
    this.save.emit(this.socialLinksForm.value);
  }

  isInvalid(field: string): boolean {
    return (
      this.socialLinksForm.controls[field].invalid &&
      this.socialLinksForm.controls[field].touched
    );
  }

  getErrorMessage(field: string): string {
    const control = this.socialLinksForm.controls[field];

    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('pattern')) {
      return 'Enter a valid URL';
    }
    return '';
  }
}
