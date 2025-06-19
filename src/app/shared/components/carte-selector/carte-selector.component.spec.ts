import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteSelectorComponent } from './carte-selector.component';

describe('CarteSelectorComponent', () => {
  let component: CarteSelectorComponent;
  let fixture: ComponentFixture<CarteSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarteSelectorComponent]
    });
    fixture = TestBed.createComponent(CarteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
