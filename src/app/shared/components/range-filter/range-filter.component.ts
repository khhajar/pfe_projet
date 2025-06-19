import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.css'],
})
export class RangeFilterComponent {
  @Input() title: string = '';
  isExpanded = false;
}
