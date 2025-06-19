import { Component, EventEmitter, Output } from '@angular/core';
import {
  CAREER_LEVELS,
  CITIES,
  WORKPLACE_TYPES,
} from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.css'],
})
export class FilterSectionComponent {
  workplaceOptions = WORKPLACE_TYPES;
  careerLevelOptions = CAREER_LEVELS;
  cityOptions = CITIES;

  selectedFilters: { [key: string]: string[] } = {
    workplace: [],
    careerLevel: [],
    city: [],
  };

  clearAllFilters = new EventEmitter<void>();
  @Output() onFilterItem = new EventEmitter<{ [key: string]: string[] }>();
  // Handle the change of selected filters
  handleFilterChange(filterData: { title: string; selectedOptions: string[] }) {
    this.selectedFilters[filterData.title] = filterData.selectedOptions;
    this.onFilterItem.emit(this.selectedFilters);
  }

  // Clear all selected filters and emit the event to clear all checkboxes
  clearFilters() {
    this.selectedFilters = {
      workplace: [],
      careerLevel: [],
      city: [],
    };
    this.clearAllFilters.emit();
  }

  // Get the number of selected filters
  get selectedFiltersCount(): number {
    return Object.values(this.selectedFilters).flat().length;
  }
}
