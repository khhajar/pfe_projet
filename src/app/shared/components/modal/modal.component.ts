import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  protected isOpen = false;
  @Output() closeModal = new EventEmitter<boolean>();

  show() {
    this.isOpen = true;
  }

  hide() {
    this.isOpen = false;
    this.closeModal.emit(true);
  }
}
