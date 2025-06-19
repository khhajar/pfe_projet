import { Component, EventEmitter, Output } from '@angular/core';
import {
  CAREER_LEVELS,
  CITIES,
  GENDER,
  WORKPLACE_TYPES,
} from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-filter-cv',
  templateUrl: './filter-cv.component.html',
  styleUrls: ['./filter-cv.component.css'],
})
export class FilterCvComponent {
  careerLevelOptions: string[] = CAREER_LEVELS;
  GenderOptions: string[] = GENDER;
  workPlaceOptions: string[] = WORKPLACE_TYPES;
  cityOptions: string[] = CITIES;

  selectedFilters: { [key: string]: string[] } = {
    careerLevels: [],
    genders: [],
    workPlaces: [],
    cities: [],
  };

  clearAllFilters = new EventEmitter<void>();
  @Output() onFilterItem = new EventEmitter<{ [key: string]: string[] }>();
  constructor() {}

  handleFilterChange(filterData: { title: string; selectedOptions: string[] }) {
    this.selectedFilters[filterData.title] = filterData.selectedOptions;
    this.onFilterItem.emit(this.selectedFilters);
  }

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
