import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.css'],
})
export class JobDescriptionComponent implements OnInit {
  @Input() formArray!: FormArray<FormControl<string | null>>;
  @Input() label!: string;

  constructor() {}

  ngOnInit(): void {}

  addItem() {
    this.formArray?.push(
      new FormControl('', [Validators.required, Validators.minLength(5)])
    );
  }

  removeItem(index: number) {
    this.formArray?.removeAt(index);
  }
}
