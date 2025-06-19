import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceSignUpComponent } from './choice-sign-up.component';

describe('ChoiceSignUpComponent', () => {
  let component: ChoiceSignUpComponent;
  let fixture: ComponentFixture<ChoiceSignUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChoiceSignUpComponent]
    });
    fixture = TestBed.createComponent(ChoiceSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
