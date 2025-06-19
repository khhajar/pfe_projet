import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter-block',
  templateUrl: './filter-block.component.html',
  styleUrls: ['./filter-block.component.css'],
})
export class FilterBlockComponent {
  @Input() title: string = '';
  @Input() selectedTitle: string = '';
  @Input() options: string[] = [];
  @Input() selected: string[] = [];
  @Input() clearFilters: EventEmitter<void> = new EventEmitter<void>(); // Event to clear the filters
  @Output() filterChange = new EventEmitter<{
    title: string;
    selectedOptions: string[];
  }>();

  expanded = false;
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      options: new FormArray([]),
    });
  }

  ngOnInit() {
    this.addOptionsControls();
    // Listen for clearFilters event to reset the form
    this.clearFilters.subscribe(() => this.resetFilters());
  }

  addOptionsControls() {
    const controlArray = this.form.get('options') as FormArray;
    controlArray.clear(); // Clear the FormArray before adding new controls
    this.options.forEach((option, index) => {
      const isChecked = this.selected.includes(option);
      controlArray.push(new FormControl(isChecked));
    });
  }

  toggleSection() {
    this.expanded = !this.expanded;
  }

  toggleSelectAll(event: any) {
    const controlArray = this.form.get('options') as FormArray;
    const value = event.target.checked;
    controlArray.controls.forEach((control) => {
      control.setValue(value);
    });

    this.onOptionToggle();
  }

  get isSelectAllChecked() {
    const controlArray = this.form.get('options') as FormArray;
    return controlArray.controls.every((control) => control.value);
  }

  onOptionToggle() {
    const selectedOptions = this.getSelectedOptions();
    this.emitFilterChange(selectedOptions);
  }

  getSelectedOptions(): string[] {
    const selectedOps: string[] = [];
    const controlArray = this.form.get('options') as FormArray;
    controlArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedOps.push(this.options[index]);
      }
    });
    return selectedOps;
  }

  emitFilterChange(selectedOptions: string[]) {
    this.filterChange.emit({
      title: this.selectedTitle,
      selectedOptions: selectedOptions,
    });
  }

  // Method to reset all filters
  resetFilters() {
    const controlArray = this.form.get('options') as FormArray;
    controlArray.controls.forEach((control) => {
      control.setValue(false); // Uncheck all checkboxes
    });
    this.emitFilterChange([]); // Emit empty array to notify the parent that no filters are selected
  }
}
