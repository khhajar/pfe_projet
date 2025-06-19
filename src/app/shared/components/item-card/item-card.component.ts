import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
})
export class ItemCardComponent {
  @Input() title?: string = '';
  @Input() subtitle?: string = '';

  @Output() removed = new EventEmitter<void>();

  onRemove() {
    this.removed.emit();
  }
}
