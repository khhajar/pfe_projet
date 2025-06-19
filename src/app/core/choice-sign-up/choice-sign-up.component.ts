import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choice-sign-up',
  templateUrl: './choice-sign-up.component.html',
  styleUrls: ['./choice-sign-up.component.css'],
})
export class ChoiceSignUpComponent {
  selectedOption: string = '';

  constructor(private router: Router) {}

  selectOption(option: string) {
    this.selectedOption = option;
  }

  createAccount() {
    if (this.selectedOption && this.selectedOption != '') {
      this.router.navigate(['/register/' + this.selectedOption]);
    }
  }
}
