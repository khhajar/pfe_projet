import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
})
export class SearchInputComponent {
  searchText: string = '';
  @Output() searchEvent = new EventEmitter<string>();

  constructor() {}

  onSearch(): void {
    this.searchEvent.emit(this.searchText.trim().toLowerCase());
  }
}
