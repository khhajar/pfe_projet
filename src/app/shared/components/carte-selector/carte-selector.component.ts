import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-carte-selector',
  templateUrl: './carte-selector.component.html',
  styleUrls: ['./carte-selector.component.css'],
})
export class CarteSelectorComponent {
  @Input() items: string[] = [];
  @Input() selectedItem: string | null | undefined = null;
  @Input() gridClass: string = 'grid grid-cols-1'; // Default grid
  @Output() selectionChange = new EventEmitter<string>();

  selectItem(item: string): void {
    this.selectionChange.emit(item);
  }
}
