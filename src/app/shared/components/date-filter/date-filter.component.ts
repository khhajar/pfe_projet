import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css'],
})
export class DateFilterComponent {
  @Input() title: string = '';
  isExpanded = false;
  options: string[] = ['All', 'Past 24 hours', 'Past week', 'Past month'];
  selectedOption: string = '';

  onSelectionChange(value: string): void {
    this.selectedOption = value;
  }
}
